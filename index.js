const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const config = require('config');
const http = require('http');
const https = require('https');
const WebSocket = require('ws');
const path = require('path');
const mongoose = require('mongoose');
const parser = require('url-parse');

const privateKey  = fs.readFileSync('./keys/privkey.pem', 'utf8');
const certificate = fs.readFileSync('./keys/cert.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate};

const PORT = config.get('port') || 5001;
const MONGO_URL = config.get('mongoUrl');

const isProduction = process.env.NODE_ENV === 'production'
                      ? true
                      : false;
const Server = isProduction
                ? https.createServer(credentials, app)
                : http.createServer(app);

const onlineClients = {};
const onlineOperators = {};
let wsOperators = new WeakMap();  //  { ws1: manager1, ws2: manager2 ... }
let wsClients = new WeakMap();  //  { ws1: client1, ws2: client2 ... }

const manager = require('./routes/helper');

app.use(express.json({ extended: true }));
app.use(cors());

app.use('/upload', express.static(path.join(__dirname, 'upload' )));
app.use('/img', express.static(path.join(__dirname, 'img' )));

// for Svelte client
app.use('/client', express.static(path.join(__dirname, 'client', 'public' )));
app.get('/client', (req, res) => {
  console.log('Svelte client req...\n', 
                '\tto ...\t', req.headers.host, 
                '\n\tfrom ...\t', req.headers.referer, req.url, req.originalUrl);
  res.sendFile(path.resolve(__dirname, 'client', 'public', 'index.html'));
})

app.use('/api/auth', require('./routes/auth.routes'));

if (isProduction) {
  app.use('/', express.static(path.join(__dirname, 'adminboard', 'build', )));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'adminboard', 'build', 'index.html'));
  })
}

const start = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    const server = await Server.listen(PORT, () => { console.log('http/https server started ...') });

    manager.getUsers();
    
    wss = new WebSocket.Server({ server, path: '/ws' });
    
    wss.on('connection', (ws, req) => {
      /**
       * start parse url
       * url = 'ws:/localhost:5001/ws?userName=vlad&userHost=localhost'
       */ 
      let params = parser(`${req.headers.origin}${req.url}`, true);
      // console.log('websocket app started...', params.query.userName, req.url, req.headers['sec-websocket-key'], req.headers.origin)
      let { hostname, query } = params;
      let { userName, userHost } = query;
      ws.isAlive = true;
      /**
       * заносим клиентов в объект onlineClients { 'clientId': { ws, email } }
       * заносим операторов в объект onlineOperators { 'operatorId': { ws } }
       * заносим операторов в WeakMap, ключом является webSocket
       */
      if (userHost) {
        let sites = manager.Sites();
        let email = sites[userHost];
        onlineClients[userName] = { ws, email };
        wsClients.set(ws, userName);
      } else {
        onlineOperators[userName] = { ws };
        wsOperators.set(ws, userName);
      }

      ws.on('message', message => {
        try {
          let data = JSON.parse(message);
          // ...data.from = message from client to site manager
          if (data.from) {
            console.log('data.from...', data.from);
            let { email } = onlineClients[data.from];
            if (onlineOperators[email]) onlineOperators[email].ws.send(JSON.stringify(data));
          }
          // ...data.to - message to client from site manager
          if (data.to) {
            onlineClients[data.to]?.ws.send(JSON.stringify(data));
          }

        } catch(e) {
          console.log('Error while received WebSocket message ... ', e, message);
        }
      });
    
      ws.on('pong', () => {
        ws.isAlive = true;
      });

      ws.on('close', () => {
        // ...delete operator entry from 'onlineOperators'
        let operatorEmail = wsOperators.get(ws);
        if (operatorEmail) delete onlineOperators[operatorEmail];

        // ...delete client entry from 'onlineClients'
        let clientEmail = wsClients.get(ws);
        if (clientEmail) delete onlineClients[clientEmail];

        console.log('<=== server close ws ===>', '\t\nOnline clients...\t', Object.keys(onlineClients), '\t\nOnline operators...\t', Object.keys(onlineOperators));
      })
    })
    
    // ...preserve constant clients connections...
    setInterval(() => {
      wss.clients.forEach(ws => {
        ws.isAlive = false;
        ws.ping();
      })
      // ...считаем количество клиентов сайта
      let onlineClientsNumber = {};
      for (let key in onlineClients) {
        let email = onlineClients[key].email;
        
        if (email in onlineClientsNumber) {
          onlineClientsNumber[email] = onlineClientsNumber[email] + 1;
        } else {
          onlineClientsNumber[email] = 1;
        }
      }
      // ...посылаем сообщение операторам о количестве клиентов
      for (let key in onlineClientsNumber) {
        let number = onlineClientsNumber[key];
        onlineOperators[key]?.ws.send(JSON.stringify({'num': number }));
      }
      /**
       * регулярно отправляем пользователям состояние оператора
       * "manager is ONLINE" или "manager is OFFLINE" в противном случае
       */
      for (const [key, value] of Object.entries(onlineClients)) {
        let { email, ws } = value;
        onlineOperators[email]
          ? ws.send(JSON.stringify({'svc': 'manager is ONLINE...', 'date': Date.now()}))
          : ws.send(JSON.stringify({'svc': 'manager is OFFLINE...', 'date': Date.now()}));
      }
    }, 10000);

  } catch (e) {
    console.log('Server error ...', e);
    process.exit(1);
  }
}

start();
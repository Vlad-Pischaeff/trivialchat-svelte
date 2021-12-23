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
const User = require('./models/User');

const isProduction = process.env.NODE_ENV === 'production'
                      ? true
                      : false;
const Server = isProduction
                ? https.createServer(credentials, app)
                : http.createServer(app);

const onlineClients = {};
const onlineOperators = {};
let wsManagers = new WeakMap();  //  { ws1: manager1, ws2: manager2 ... }

const emitter = require('./routes/service');
const manager = require('./routes/helper');

app.use(express.json({ extended: true }));
app.use(cors());

app.use('/upload', express.static(path.join(__dirname, 'upload' )));
app.use('/img', express.static(path.join(__dirname, 'img' )));
app.use('/fonts', express.static(path.join(__dirname, 'fonts' )));
app.use('/css', express.static(path.join(__dirname, 'css' )));
app.use('/js', express.static(path.join(__dirname, 'js' )));
// for Vue client
app.get('/tchat', (req, res) => {
    // console.log('tchat req...', 'to ...', req.headers.host, 'from ...', req.headers.referer, req.url, req.originalUrl)
    res.sendFile(path.resolve(__dirname, 'tchat', 'main.html'));
  }
)
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
    })

    const server = await Server.listen(PORT, () => { console.log('http/https server started ...') })

    emitter.emit('get users');
    
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
        let email = sites[userHost]
        onlineClients[userName] = { ws, email };
      } else {
        onlineOperators[userName] = { ws };
        wsManagers.set(ws, userName);
      }
      /**
       * если оператор подключился, то пользователям отправляем
       * "manager is ONLINE" или "manager is OFFLINE" в противном случае
       */
      for (const [key, value] of Object.entries(onlineClients)) {
        let { email, ws } = value;
        onlineOperators[email]
          ? ws.send(JSON.stringify({'svc': 'manager is ONLINE...', 'date': Date.now()}))
          : ws.send(JSON.stringify({'svc': 'manager is OFFLINE...', 'date': Date.now()}));
      }

      ws.on('message', message => {
        try {
          let data = JSON.parse(message);

          if (data.from) {              // data.from = message from client to site manager
            let { email } = onlineClients[data.from];
            if (onlineOperators[email]) onlineOperators[email].ws.send(JSON.stringify(data));
          }

          if (data.to) {                 // data.to - message to client from site manager
            onlineClients[data.to].ws.send(JSON.stringify(data));
          }

        } catch(e) {
          console.log('Error while received WebSocket message ... ', e, message)
        }
      })
    
      ws.on('pong', () => {
        ws.isAlive = true
      })

      ws.on('close', () => {

        let operatorEmail = wsManagers.get(ws)         // send warning to all clients, "manager is OFFLINE..."

        for (const [key, value] of Object.entries(onlineClients)) {
          let { email, ws } = value;
          if (operatorEmail === email) {
            ws.send(JSON.stringify({'svc': 'manager is OFFLINE...', 'date': Date.now()}));
          }
        }
      })
    })
    
    // ...preserve constant clients connections...
    setInterval(() => {
      wss.clients.forEach(ws => {
        ws.isAlive = false;
        ws.ping();
      })
    }, 10000);

  } catch (e) {
    console.log('Server error ...', e);
    process.exit(1);
  }
}

start();
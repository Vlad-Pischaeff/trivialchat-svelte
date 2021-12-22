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

const wsUsers = {};              //  { user1: ws1, user2: ws2 ... }
let wsClients = new WeakMap();   //  { ws1: client1, ws2: client2 ... }
let wsManagers = new WeakMap();  //  { ws1: manager1, ws2: manager2 ... }
let managedClients = {};         //  { manager1: [client1, client2, ...], manager2: [client3, client4, ...], ... }
let countedSites = {};           //  { site1: manager1, site2: manager2 ... }
let countedEmails = {};          //  { manager1: site1, manager2: site2 ... }
const emitter = require('./routes/service');
// const manager = require('./routes/helper');

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

    emitter.on('get users', getUsers);
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
       * проверяем, клиент подключился первый раз, или нет
       */
      wsUsers[userName] = ws;
      let managerEmail = countedSites[userHost];
      /**
       * если оператор подключился, то пользователям отправляем
       * "manager is ONLINE" или "manager is OFFLINE" в противном случае
       */
      wsUsers[managerEmail]
        ? wsUsers[userName].send(JSON.stringify({'svc': 'manager is ONLINE...', 'date': Date.now()}))
        : wsUsers[userName].send(JSON.stringify({'svc': 'manager is OFFLINE...', 'date': Date.now()}));
      emitter.emit('add websocket clients', { ws, query });

      ws.on('message', message => {
        try {
          let data = JSON.parse(message);

          if (data.from && countedSites[userHost]) {    // data.from = message from client to site manager
            let destination = countedSites[userHost]    // operator email
            wsUsers[destination] && wsUsers[destination].send(JSON.stringify(data))
          }
          if (data.to) {                                // data.to - message to client from site manager
            wsUsers[data.to].send(JSON.stringify(data))
          }
          if (data.operatorOnline) {
            console.log('operator...', userName, 'is online...', 'clients...', managedClients)
            emitter.emit('add websocket managers', { ws, query })
            if (managedClients[userName]) {
              managedClients[userName].forEach(client => 
                wsUsers[client].send(JSON.stringify({'svc': 'manager is ONLINE...', 'date': Date.now()}))
              )
            }
          }
        } catch(e) {
          console.log('Error while received WebSocket message ... ', e, message)
        }
      })
    
      ws.on('pong', () => {
        ws.isAlive = true
      })

      ws.on('close', () => {
        // console.log('ws Close...', wsManagers.get(ws), wsClients.get(ws))
        let managerEmail = wsManagers.get(ws)         // send warning to all clients, "manager is OFFLINE..."
        if (managedClients[managerEmail]) {
          managedClients[managerEmail].forEach(client => 
            wsUsers[client].send(JSON.stringify({'svc': 'manager is OFFLINE...', 'date': Date.now()}))
          )
        }
        wsUsers[managerEmail] = null
      })
    })
    
    // ...preserve constant clients connections...
    setInterval(() => {
      wss.clients.forEach(ws => {
        ws.isAlive = false
        ws.ping()
      })
    }, 10000)

  } catch (e) {
    console.log('Server error ...', e)
    process.exit(1)
  }
}

start()

const getUsers = async () => {
  try {
    const users = await User.find({})
    countedSites = users.reduce((allNames, name) => {     // CountedSites = { site: email }
      allNames[name.site] = name.email
      return allNames
    }, {})
    countedEmails = users.reduce((allNames, name) => {    // CountedEmails = { email: site }
      allNames[name.email] = name.site
      return allNames
    }, {})
    console.log('emitter on GET USERS ...\n', 'countedSites...\t \n', countedSites, '\n countedEmails...\t', countedEmails)
  } catch(e) {
    console.log('getUsers error ...', e)
  }
}

emitter.on('add websocket managers', data => {
  let { ws, query } = data
  if (!query.userHost) {                     // only client has query.userHost
    wsManagers.set(ws, query.userName)
    // console.log('WS managers...', query.userName)
  }
})

emitter.on('add websocket clients', data => {
  let { ws, query } = data
  if (query.userHost) {                       // only client has query.userHost
    let managerEmail = countedSites[query.userHost]

    if (managedClients[managerEmail]) {
      if (!managedClients[managerEmail].includes(query.userName)) {
        managedClients[managerEmail] = [...managedClients[managerEmail], query.userName]
      }
    } else {
      managedClients[managerEmail] = [query.userName]
    }
    console.log('WS clients...', managedClients)
  }
})
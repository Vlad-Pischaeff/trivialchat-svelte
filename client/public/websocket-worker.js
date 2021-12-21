let ws;
const swListener = new BroadcastChannel('swListener');

function swMessage(type, msg) {
  this.type = type;
  this.msg = msg;
}

self.addEventListener('install', event => {
  self.skipWaiting();
  console.log('Инициализация [Service Worker]...');
});

self.addEventListener('activate', (event) => {
  console.log('Активирован...', event);
});

self.addEventListener('fetch', (event) => {
  console.log('Происходит запрос на сервер...');
});

self.addEventListener('message', event => {
  console.log('Пришло сообщение на сервер...', event.type, event.data, event.source);
  let incomingMessage = JSON.parse(event.data);

  if (incomingMessage.type === 'init') {
    ws = new WebSocket(incomingMessage.msg);

    ws.onmessage = (event) => {
      swListener.postMessage(event.data);
    }
  
    ws.onopen = () => {
      ws.send(JSON.stringify({'newClientConnection': 'Session.userID', 
                              'msg': 'initial connection...', 
                              'date': Date.now()}));
    }
  
    ws.onerror = () => {
      console.log('ws response error...');
    }
  }  

  if (incomingMessage.type === 'post') {
    ws.send(JSON.stringify(incomingMessage.msg));
  }

});
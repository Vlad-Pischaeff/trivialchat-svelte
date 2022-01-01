let ws, userId, isActivated = false;
const CACHE = 'v1';
const swListener = new BroadcastChannel('swListener');

function swMessage(type, msg) {
  this.type = type;
  this.msg = msg;
}

self.addEventListener('install', event => {
  // self.skipWaiting();
  console.log('Инициализация [Service Worker]...');
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll([
          './ping.txt'
        ])
  ));
});

self.addEventListener('activate', (event) => {
  console.log('Активирован...', event);
  isActivated = true;
});

self.addEventListener('fetch', (event) => {
  console.log('Происходит запрос на сервер...', event);
  if (isActivated) event.respondWith(fromCache(event.request));
  swListener.postMessage(JSON.stringify({ 'wsUser': userId }));
});

function fromCache(request) {
  return caches.open(CACHE).then((cache) =>
    cache.match(request)
        .then((matching) => matching || Promise.reject('no-match'))
  );
}

self.addEventListener('message', event => {
  console.log('Пришло сообщение на сервер...', event.type, event.data, event.source);
  let incomingMessage = JSON.parse(event.data);

  if (incomingMessage.type === 'init') {

    if (!userId) {
      userId = incomingMessage.userId;
      ws = new WebSocket(incomingMessage.msg);
      console.log('Открываем новый WebSocket...');

      ws.onmessage = (event) => {
        swListener.postMessage(event.data);
      }
    
      ws.onopen = () => {
        swListener.postMessage(JSON.stringify({ 'wsState': 'open' }));
        ws.send(JSON.stringify({'newClientConnection': 'Session.userID', 
                                'msg': 'initial connection...', 
                                'date': Date.now()}));
        console.log('ws открыт...');
      }
    
      ws.onerror = () => {
        swListener.postMessage(JSON.stringify({ 'wsState': 'error' }));
        console.log('ws response ошибка...');
      }

      ws.onclose = () => {
        swListener.postMessage(JSON.stringify({ 'wsState': 'close' }));
        console.log('ws закрыт...');
      }
    }
  }  

  if (incomingMessage.type === 'post') {
    ws.send(JSON.stringify(incomingMessage.msg));
  }

});
let ws, userId, timeInterval = 5000, timerId;

const swListener = new BroadcastChannel('swListener');

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
  // console.log('--self Инициализация...');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
  // console.log('--self Активирован...');
  swListener.postMessage(JSON.stringify({ 'wsState': 'init' }));
});

self.addEventListener('fetch', (event) => {
  event.waitUntil(self.skipWaiting());
  // console.log('--self Запрос...', event.request.url);
  // let isPing = /ping/i.test(event.request.url);
  if (ws === undefined || ws?.readyState === WebSocket.CLOSED) {
    swListener.postMessage(JSON.stringify({ 'wsState': 'init' }));
  }
  userId && swListener.postMessage(JSON.stringify({ 'wsUser': userId }));
});

self.addEventListener('message', event => {
  event.waitUntil(self.skipWaiting());
  // console.log('--self Сообщение...', event.data);
  let incomingMessage = JSON.parse(event.data);

  if (incomingMessage.type === 'init') {
    if (!userId) {
      userId = incomingMessage.userId;
      wsConnect(incomingMessage.msg);
    }
  }  

  if (incomingMessage.type === 'post') {
    ws.send(JSON.stringify(incomingMessage.msg));
  }

});

function wsConnect(url) {
  ws = new WebSocket(url);
  // console.log('--ws новый WebSocket...');
  
  ws.onmessage = (event) => {
    swListener.postMessage(event.data);
    // console.log('--ws получил сообщение...');
  }
  
  ws.onopen = () => {
    clearTimeout(timerId);
    // console.log('--ws открыт...');
  }
  
  // ws.onerror = () => {
  //   console.log('--ws ошибка...');
  // }
  
  ws.onclose = () => {
    // console.log('--ws закрыт...');
    // try to reconnect
    timerId = setTimeout(() => wsConnect(url), timeInterval);
  }
}
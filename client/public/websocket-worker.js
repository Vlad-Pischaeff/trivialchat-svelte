let ws, userId, timeInterval = 2500, timerId;

const swListener = new BroadcastChannel('swListener');

self.addEventListener('install', event => {
  console.log('--self Инициализация...');
});

self.addEventListener('activate', (event) => {
  console.log('--self Активирован...');
  swListener.postMessage(JSON.stringify({ 'wsState': 'init' }));
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  console.log('--self Запрос...', ws.readyState);
  if (ws.readyState === WebSocket.CLOSED) {
    swListener.postMessage(JSON.stringify({ 'wsState': 'init' }));
  }
  swListener.postMessage(JSON.stringify({ 'wsUser': userId }));
});

self.addEventListener('message', event => {
  console.log('--self Сообщение...', 'event.type', event.data, 'event.source');
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
  console.log('--ws новый WebSocket...');
  
  ws.onmessage = (event) => {
    swListener.postMessage(event.data);
    console.log('--ws получил сообщение...');
  }
  
  ws.onopen = () => {
    swListener.postMessage(JSON.stringify({ 'wsState': 'open' }));
    clearTimeout(timerId);
    console.log('--ws открыт...');
  }
  
  ws.onerror = () => {
    swListener.postMessage(JSON.stringify({ 'wsState': 'error' }));
    console.log('--ws ошибка...');
  }
  
  ws.onclose = () => {
    swListener.postMessage(JSON.stringify({ 'wsState': 'close' }));
    console.log('--ws закрыт...');
    // try to reconnect
    timerId = setTimeout(() => wsConnect(url), timeInterval += timeInterval);
  }
}
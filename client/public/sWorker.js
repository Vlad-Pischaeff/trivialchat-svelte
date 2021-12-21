self.addEventListener('install', event => {
  console.log('Installing [Service Worker]', event);
  ws = new WebSocket('ws://localhost:5001/ws');
  console.log('Installing [Web Socket]', ws);
  // ws = new WebSocket(`${WS_URL}?userName=${Session.userID}&userHost=${Session.userHOST}`);
});

self.addEventListener('activate', (event) => {
  console.log('Активирован');
});

self.addEventListener('fetch', (event) => {
  console.log('Происходит запрос на сервер');
});
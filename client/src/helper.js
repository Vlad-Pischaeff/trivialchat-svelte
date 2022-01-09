export function random_id() {
  return (
    Number(String(Math.random()).slice(2)) + 
    Date.now() + 
    Math.round(performance.now())
  ).toString(36);
}

export function isEmpty(obj) {
  for (let key in obj) {
    // если тело цикла начнет выполняться - значит в объекте есть свойства
    return false;
  }
  return true;
}

const {	API_HOST_DEV,	API_PORT_DEV,	API_HOST,	API_PORT, isProd } = __app['env'];
export let WS_URL, URL;

if (isProd) {
  URL = `https://${API_HOST}:${API_PORT}`;
  WS_URL = `wss://${API_HOST}:${API_PORT}/ws`;
} else {
  URL = `http://${API_HOST_DEV}:${API_PORT_DEV}`;
  WS_URL = `ws://${API_HOST_DEV}:${API_PORT_DEV}/ws`;
}

let url = (window.location != window.parent.location)
  ? document.referrer         									// ... https://tele.scope.cf
  : document.location.href;   									// ... https://tchat.scope.cf:5001/client
export let HOST = url.split(':')[1].split('/')[2];

export function MessageObj(msg, from) {
  this.from = from;
  this.msg = msg;
  this.date = Date.now();
}

export function swMessageObj(type, msg, userId) {
  this.type = type;
  this.msg = msg;
  this.userId = userId;
}
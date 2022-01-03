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
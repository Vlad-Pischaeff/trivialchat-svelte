import { writable, get, derived } from 'svelte/store';
import { operator, clients, selectedUserIdx, isAuthorized } from './store';

let socket, manager;
let { VITE_NAME : hostname, 
      VITE_PORT : port, 
      VITE_PREFIX : httpPrefix } = import.meta.env;

let wsPrefix = httpPrefix === 'http' ? 'ws' : 'wss';
let ws_url = `${wsPrefix}://${hostname}:${port}/ws`;
export const url = `${httpPrefix}://${hostname}:${port}`;
export const clientsNumber = writable(0);

operator.subscribe(n => manager = n);

const messageStore = writable('');

export const wsInitialized = derived(isAuthorized, $isAuthorized => {
  
  if ($isAuthorized) {
    const { email } = manager;
    socket = new WebSocket(ws_url + '?userName=' + email);
    console.log('new WS...', $isAuthorized);

    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({ 'operatorOnline': email, 'msg': 'initial connection...', 'date': Date.now() }));
    });
  
    socket.addEventListener('message', event => {
      let data = JSON.parse(event.data);
      if (!data.svc && !data.num) clients.modify(JSON.parse(event.data));
      if (data.num) clientsNumber.set(data.num);
    });

    return true;
  } else {
    if (socket) socket.close();
    return false;
  }
});

export const enabledGreenLight = derived(isAuthorized, $isAuthorized => {
  return $isAuthorized === undefined 
    ? false 
    : $isAuthorized;
});

const sendMessage = (msg) => {
  if (socket.readyState <= 1) {
    let client = get(clients);
    let clientIdx = get(selectedUserIdx);
    let message = JSON.stringify({ 'to': client[clientIdx]['user'], msg, 'date': Date.now() })
    socket.send(message);
  }
};

export const wstore = {
  subscribe: messageStore.subscribe,
  sendMessage
};

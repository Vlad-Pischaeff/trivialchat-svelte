import { writable, get } from 'svelte/store';
import { operator, clients, selectedUserIdx } from './store';

let { hostname, protocol : httpPrefix } = window.location;
let wsPrefix = httpPrefix === 'http:' ? 'ws:' : 'wss:';
let ws_url = `${wsPrefix}//${hostname}:5001/ws`;

export const url = writable(`${httpPrefix}//${hostname}:5001`);

const messageStore = writable('');
const manager = get(operator);

const socket = new WebSocket(ws_url + '?userName=' + manager.email);

// Connection opened
socket.addEventListener('open', function (event) {
	let email = manager.email;
	socket.send(JSON.stringify({ 'newManagerConnection': email, 'msg': 'initial connection...', 'date': Date.now() }));
});

// Listen for messages
socket.addEventListener('message', function (event) {
	let data = JSON.parse(event.data);
	console.log('received message from', event);
	clients.modify(data);
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
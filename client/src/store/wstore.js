import { writable } from 'svelte/store';

let { hostname, protocol : httpPrefix } = window.location;
let wsPrefix = httpPrefix === 'http:' ? 'ws:' : 'wss:';
let ws_url = `${wsPrefix}//${hostname}:5001/ws`;
let url = `${httpPrefix}//${hostname}:5001`

const messageStore = writable('');

const socket = new WebSocket(ws_url);

// Connection opened
socket.addEventListener('open', function (event) {
    console.log("It's open");
});

// Listen for messages
socket.addEventListener('message', function (event) {
    messageStore.set(event.data);
});

const sendMessage = (message) => {
	if (socket.readyState <= 1) {
		socket.send(message);
	}
}

console.log('wstore...', window.location);

export default {
	subscribe: messageStore.subscribe,
	sendMessage
}
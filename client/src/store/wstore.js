import { writable, get, derived } from 'svelte/store';
import { operator, clients, selectedUserIdx, isAuthorized } from './store';

let socket, manager;
let { VITE_NAME : hostname, 
			VITE_PORT : port, 
			VITE_PREFIX : httpPrefix } = import.meta.env;

let wsPrefix = httpPrefix === 'http' ? 'ws' : 'wss';
let ws_url = `${wsPrefix}://${hostname}:${port}/ws`;
export const url = `${httpPrefix}://${hostname}:${port}`;

// console.log('wstore..., env', import.meta.env)

operator.subscribe(n => manager = n);

const messageStore = writable('');

export const wsInitialized = derived(isAuthorized, $isAuthorized => {
	if ($isAuthorized) {
		const { email } = manager;
		socket = new WebSocket(ws_url + '?userName=' + email);

		socket.addEventListener('open', () => {
			socket.send(JSON.stringify({ 'newManagerConnection': email, 'msg': 'initial connection...', 'date': Date.now() }));
		});
	
		socket.addEventListener('message', event => {
			clients.modify(JSON.parse(event.data));
		});

		socket.addEventListener('close', () => {
			$isAuthorized = false;
			$selectedUserIdx = null;
		});

		socket.addEventListener('error', () => {
			$isAuthorized = false;
			$selectedUserIdx = null;
		});

		return true;
	} else {
		if (socket) socket.close();
		return false;
	}
});

export const enabledGreenLight = derived(wsInitialized, $wsInitialized => {
	return $wsInitialized === undefined 
		? false 
		: $wsInitialized;
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

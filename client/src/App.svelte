<script>
	import { onDestroy, onMount } from 'svelte';
	import { iconAvatar, iconOK } from './icons';
	import { random_id, isEmpty } from './helper';

	const {	API_HOST_DEV,	API_PORT_DEV,	API_HOST,	API_PORT, isProd } = __app['env'];
	let WS_URL, URL, HOST, USER;

	if (isProd) {
		URL = `https://${API_HOST}:${API_PORT}`;
		WS_URL = `wss://${API_HOST}:${API_PORT}/ws`;
	} else {
		URL = `http://${API_HOST_DEV}:${API_PORT_DEV}`;
		WS_URL = `ws://${API_HOST_DEV}:${API_PORT_DEV}/ws`;
	}

	let title = 'FAKE CORP.', desc = 'Manager', avatar = iconAvatar,
      messages = [], inputVal = '',
			msgRef,	Session, myWorker, webWorker, 
			isReadyServiceWorker = false, isNewSession = false;

	const swListener = new BroadcastChannel('swListener');

	swListener.onmessage = function(e) {
		console.log('swListener Received', e.data);
		let message = JSON.parse(e.data);
		if (message.wsState) {
			//...webSocket state messages
			console.log('webSocket state...', message.wsState);
		} else {
			//...WebSocket clients messages
			messages = [ ...messages, message];
		}
	};

	const sendMessage = () => {
		if (inputVal !== '') {
			let message = new MessageObj(inputVal)
			messages = [ ...messages, message];
			inputVal  = '';
			let swMessage = new innerMessageObj('post', message);
			myWorker.postMessage(JSON.stringify(swMessage));
			console.log('send message...', swMessage);
		}
	}

	const onKeyPress = e => { if (e.charCode === 13) sendMessage()};

	function MessageObj(msg) {
		this.from = Session.userID;
		this.msg = msg;
		this.date = Date.now();
	}

	function innerMessageObj(type, msg) {
		this.type = type;
		this.msg = msg;
	}

	$: if (Session) { 
		Session.userMSGS = messages;
		sessionStorage.setItem('tchat', JSON.stringify(Session));
	}
	$: if (msgRef) msgRef.scrollIntoView({ behavior: 'smooth' });
	$: if (Session?.userID) USER = Session.userID;
	$: if (Session?.userHOST) HOST = Session.userHOST;
	$: if (Session?.userAvatar) avatar = Session.userAvatar;
	$: if (Session?.userTitle) title = Session.userTitle;
	$: if (Session?.userDesc) desc = Session.userDesc;
	$: if (isReadyServiceWorker && isNewSession) {
			let innerMsg = new innerMessageObj('init', `${WS_URL}?userName=${USER}&userHost=${HOST}`);
			myWorker.postMessage(JSON.stringify(innerMsg));
			console.log('swState activated...', 'init message...', innerMsg);
			if (window.Worker) {
				webWorker = new Worker("wsWorker.js");
				console.log('webWorker start...', webWorker);
				webWorker.postMessage({'init': `${WS_URL}?userName=${USER}&userHost=${HOST}`});
			}
		}

	onMount(async () => {
		Session = JSON.parse(sessionStorage.getItem('tchat')) || {};
		isNewSession = isEmpty(Session) ? true : false;
		/**
		 * restore the user's session from sessionStorage, 
		 * if there is nothing there, we get the data from the server
		 */
    if (Object.entries(Session).length === 0) {

      Session.userID = random_id();

      let url = (window.location != window.parent.location)
        ? document.referrer         									// ---- https://tele.scope.cf
        : document.location.href;   									// ---- https://tchat.scope.cf:5001/client
      Session.userHOST = url.split(':')[1].split('/')[2];
			
      let response = await fetch(`${URL}/api/auth/usersite/${Session.userHOST}`)
                            .then(response => response.json())
														.catch(e => e);

      if (!response.message) {
        ({ 	avatar : Session.userAvatar, 
						greeting: Session.userGreeting, 
						title: Session.userTitle, 
						desc: Session.userDesc } = response);
      }

      Session.userMSGS = [{ to: 'me', msg: Session.userGreeting, date: Date.now() }];
			messages = Session.userMSGS;

			sessionStorage.setItem('tchat', JSON.stringify(Session));

		} else {
			messages = Session.userMSGS;
		}
		/**
		 * set serviceWorker if it does not exist or activate it if it does
		 */
		if (navigator.serviceWorker.controller) {
			myWorker = navigator.serviceWorker.controller;
			console.log('is already has controller...', myWorker.state);
			isReadyServiceWorker = true;
		} else {
			navigator.serviceWorker
				.register('websocket-worker.js')
				.then((registration) => {
					if (registration.installing) {
						myWorker = registration.installing;
					} else if (registration.waiting) {
						myWorker = registration.waiting;
					} else if (registration.active) {
						myWorker = registration.active;
					}

					if (myWorker) {
						myWorker.addEventListener('statechange', e => {
							console.log('else not yet has controller...', myWorker.state);
							if (e.target.state === 'activated') {
								isReadyServiceWorker = true;
							}
						});
					}
				});
		}
		/**
		 * make queries for the cached empty file so that the sarviceWorker is always active
		 */
		let timerId = setInterval(() => { fetch('/ping.txt')}, 20000);
		return () => clearInterval(timerId);

	});

</script>

<main class="cp" id="App">
	<section class="cp_header">
		<picture class="cp_header-avatar">
			<img class="cp_header-avatarimg" src={avatar} alt="avatar">
		</picture>
		<div class="cp_header-card">
			<div class="cp_header-card-1">{title}</div>
			<div class="cp_header-card-2">{desc}</div>
		</div>
	</section>
	<section class="cp_body">
		<div class="chat_field">
			{#if messages.length !== 0}
				{#each messages as message }
					{#if (message.svc)}
						<div class="service">{message.svc} {new Date(message.date).toLocaleString()}</div>
					{:else}
						<div 	class="chat_field-message" 
									data-align="{message.from ? 'from' : 'to'}" 
									bind:this={msgRef}>
							<div class="{message.from ? 'chat_field-messagefrom' : 'chat_field-messageto'}">
								<p class="msg-data">{ new Date(message.date).toLocaleString()}</p>
								<p class="msg-text">{message.msg}</p>
							</div>
						</div>
					{/if}
				{/each}
			{/if}
		</div>
	</section>
	<footer class="cp_footer">
		<div class="chat_input">
			<input 	class="chat_input-text" name="question" bind:value={inputVal} 
							type="text" 
							placeholder="type your question ..."
							on:keypress={onKeyPress}>
			<img 	class="chat_input-icon" src={iconOK} alt="OK" 
						on:click={sendMessage}>
		</div>
	</footer>
</main>
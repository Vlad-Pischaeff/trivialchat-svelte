<script>
	import { onMount } from 'svelte';
	import { iconAvatar, iconOK } from './icons';
	import { random_id } from './helper';

	const { hostname, protocol : httpPrefix } = window.location  
	const wsPrefix = httpPrefix === 'http:' ? 'ws:' : 'wss:'
	const URL = `${httpPrefix}//${hostname}:5001`
	const WS_URL = `${wsPrefix}//${hostname}:5001/ws`

	let placeholderStr = 'type your question ...',
      title = 'FAKE CORP.', 
      desc = 'Manager',
      avatar = iconAvatar,
      messages = [],
      ws = null,
      inputVal = '',
			msgRef,	Session;
	
	const receiveMessage = (message) => {
		messages = [ ...messages, message];
    Session.userMSGS = messages;
		sessionStorage.setItem('tchat', JSON.stringify(Session));
	};

	const sendMessage = () => {
		if (inputVal !== '') {
			let message = new MessageObj(inputVal)
			ws.send(JSON.stringify(message));
			inputVal  = '';
			messages = [ ...messages, message];
			Session.userMSGS = messages;
			sessionStorage.setItem('tchat', JSON.stringify(Session));
		}
	}

	const onKeyPress = e => { if (e.charCode === 13) sendMessage()};

	function MessageObj(msg) {
		this.from = Session.userID;
		this.msg = msg;
		this.date = Date.now();
	}

	$: if (msgRef) msgRef.scrollIntoView({ behavior: 'smooth' });
	$: if (Session?.userAvatar) avatar=Session.userAvatar;
	$: if (Session?.userTitle) title=Session.userTitle;
	$: if (Session?.userDesc) desc=Session.userDesc;

	onMount(async () => {
		Session = JSON.parse(sessionStorage.getItem('tchat')) || {};
		
    if (Object.entries(Session).length === 0) {

      Session.userID = random_id();

      let url = (window.location != window.parent.location)
        ? document.referrer         									// ---- https://tele.scope.cf
        : document.location.href;   									// ---- https://tchat.scope.cf:5001/tchat
      Session.userHOST = url.split(':')[1].split('/')[2];

      let response = await fetch(`${URL}/api/auth/usersite/${Session.userHOST}`)
                            .then(response => response.json());

      if (!response.message) {
        ({ 	avatar : Session.userAvatar, 
						greeting: Session.userGreeting, 
						title: Session.userTitle, 
						desc: Session.userDesc } = response);
      }

      Session.userMSGS = [{ to: 'me', msg: Session.userGreeting, date: Date.now()}];
			messages = Session.userMSGS;

			sessionStorage.setItem('tchat', JSON.stringify(Session));
    } else {
			messages = Session.userMSGS;
		}

		ws = new WebSocket(`${WS_URL}?userName=${Session.userID}&userHost=${Session.userHOST}`);

    ws.onmessage = (event) => {
      receiveMessage(JSON.parse(event.data));
    }

		ws.onopen = () => {
      ws.send(JSON.stringify({'newClientConnection': Session.userID, 
															'msg': 'initial connection...', 
															'date': Date.now()}));
    }

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
					{#if (message.msg === "manager is OFFLINE..." ||
								message.msg === "manager is ONLINE...")}
								<div class="service">{message.msg} {new Date(message.date).toLocaleString()}</div>
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
							placeholder={placeholderStr}
							on:keypress={onKeyPress}>
			<img 	class="chat_input-icon" src={iconOK} alt="OK" 
						on:click={sendMessage}>
		</div>
	</footer>
</main>

<style>

</style>
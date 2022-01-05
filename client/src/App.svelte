<script>
  import { onDestroy, onMount } from 'svelte';
  import { iconAvatar } from './icons';
  import { random_id, isEmpty, WS_URL, URL } from './helper';
  import Header from './Header.svelte';
  import Message from './Message.svelte';
  import Footer from './Footer.svelte';

  let messages = [], inputVal = '', Session, myWorker, timerId, counter = 1;
  let	isNewSession = false;

  const swListener = new BroadcastChannel('swListener');

  swListener.onmessage = function({data}) {
    console.log('swListener Received', data);
    let message = JSON.parse(data);

    if (message.svc) {
      Session.online = /ONLINE/i.test(message.svc);
      saveSession();
    }

    if (message.wsState) {
      //...webSocket state messages
      console.log('webSocket state...', message.wsState);
    }

    if (message.wsUser) {
      //...restore UserId
      Session.userID = message.wsUser;
    } 

    if (message.to) {
      //...WebSocket clients messages
      messages = [ ...messages, message];
    }
  };

  const sendMessage = (val) => {
    let message = new MessageObj(val)
    messages = [ ...messages, message];
    let swMessage = new innerMessageObj('post', message);
    myWorker.postMessage(JSON.stringify(swMessage));
  }

  function MessageObj(msg) {
    this.from = Session.userID;
    this.msg = msg;
    this.date = Date.now();
  }

  function innerMessageObj(type, msg, userId) {
    this.type = type;
    this.msg = msg;
    this.userId = userId;
  }

  const saveMessages = () => {
    if (Session) { 
      Session.userMSGS = messages;
      saveSession();
    }
  }

  const saveSession = () => {
    sessionStorage.setItem('tchat', JSON.stringify(Session));
  }

  const pingTest = async () => {
    await fetch('./ping.txt');
  }

  $: if (messages.length !== 0) saveMessages();

  $: if (myWorker && isNewSession) {
      let innerMsg = new innerMessageObj('init', `${WS_URL}?userName=${Session.userID}&userHost=${Session.userHOST}`, `${Session.userID}`);
      myWorker.postMessage(JSON.stringify(innerMsg));
      isNewSession = false;
      console.log('swState init...');
    }

  $: if (counter) pingTest();

  onMount(async () => {
    Session = JSON.parse(sessionStorage.getItem('tchat')) || {};
    isNewSession = isEmpty(Session) ? true : false;
    /**
     * restore the user's session from sessionStorage, 
     * if there is nothing there, we get the data from the server
     */
    if (isNewSession) {

    if (!Session.userID) Session.userID = random_id();
      Session.online = false;													// ...operator is OFFLINE by default

      let url = (window.location != window.parent.location)
        ? document.referrer         									// ---- https://tele.scope.cf
        : document.location.href;   									// ---- https://tchat.scope.cf:5001/client
      Session.userHOST = url.split(':')[1].split('/')[2];
			
      let response = await fetch(`${URL}/api/auth/usersite/${Session.userHOST}`)
                            .then(response => response.json())
                            .catch(e => e);

      if (!response.message) {
        Session.userTitle = response.title
          ? response.title
          : 'FAKE corporation.';
        Session.userDesc = response.desc
          ? response.desc
          : 'I\'am Your online Manager';
        Session.userAvatar = response.avatar
          ? response.avatar
          :	iconAvatar;
        Session.userGreeting = response.greeting
          ? response.greeting
          : "Hello. What can I help You ?...";
      }

      Session.userMSGS = [{ to: 'me', msg: Session.userGreeting, date: Date.now() }];
      messages = Session.userMSGS;

      saveSession();

    } else {
      messages = Session.userMSGS;
    }
    /**
     * set serviceWorker if it does not exist or activate it if it does
     */
    if (navigator.serviceWorker.controller) {
      myWorker = navigator.serviceWorker.controller;
    } else {
      navigator.serviceWorker.register('websocket-worker.js')
        .then(() => navigator.serviceWorker.ready.then((worker) => {
          myWorker = worker.active;
        }))
        .catch((err) => console.log(err));
    }

    timerId = setInterval(() => counter++, 10000);

  });

  onDestroy(() => clearInterval(timerId));

</script>

<main class="cp" id="App">
  <Header Session={Session} />
  <section class="cp_body">
    <div class="chat_field">
      {#if messages.length !== 0}
        {#each messages as message }
          <Message message={message} />
        {/each}
      {/if}
    </div>
  </section>
  <Footer sendMessage={sendMessage} inputVal={inputVal} />
</main>
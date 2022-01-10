<script>
  import { onMount } from 'svelte';
  import { iconAvatar } from './icons';
  import { random_id, isEmpty, WS_URL, URL, HOST, swMessageObj, MessageObj } from './helper';
  import Header from './Header.svelte';
  import Message from './Message.svelte';
  import Footer from './Footer.svelte';

  let messages = [], inputVal = '', Session, myWorker; 
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
      if (message.wsState === 'init') {
        let innerMsg = new swMessageObj('init', `${WS_URL}?userName=${Session.userID}&userHost=${Session.userHOST}`, `${Session.userID}`);
        myWorker?.postMessage(JSON.stringify(innerMsg));
      }
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
    let message = new MessageObj(val, Session.userID);
    messages = [ ...messages, message];
    let swMessage = new swMessageObj('post', message);
    myWorker.postMessage(JSON.stringify(swMessage));
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

  $: if (messages.length !== 0) saveMessages();

  onMount(async () => {
    Session = JSON.parse(sessionStorage.getItem('tchat')) || {};
    isNewSession = isEmpty(Session) ? true : false;
    /**
     * restore the user's session from sessionStorage, 
     * if there is nothing there, we get the data from the server
     */
    if (isNewSession) {

      if (!Session.userID) Session.userID = random_id();

      let response = await fetch(`${URL}/api/auth/usersite/${HOST}`)
                            .then(response => response.json())
                            .catch(e => e);

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

      Session.online = false;             // ... operator is OFFLINE by default
      Session.userHOST = HOST;
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
  });

</script>

<main class="cp" id="App">
  <Header Session={Session} />
  <section class="cp_body">
    <div class="chat_field">
      {#if messages.length !== 0}
        {#each messages as message (message.date)}
          <Message message={message} />
        {/each}
      {/if}
    </div>
  </section>
  <Footer sendMessage={sendMessage} inputVal={inputVal} />
</main>
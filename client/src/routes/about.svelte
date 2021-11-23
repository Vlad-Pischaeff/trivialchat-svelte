<script>
  import Clients from '../components/Clients.svelte';
  import Messages from '../components/Messages.svelte';
  import Templates from '../components/Templates.svelte';
  import MessageInput from '../components/MessageInput.svelte';
  import { onMount} from 'svelte';
  import { isAuthorized, operator } from '../store/store';

  let WS_URL;

  const initWS = () => {
    let WS = new WebSocket(WS_URL + '?userName=' + $operator.email);

    console.log('init WebSocket', WS);

    WS.onmessage = (msg) => {
      let data = JSON.parse(msg.data);
      // Emitter.emit('received message from', data)
      console.log('received message from', data);
    }

    WS.onopen = () => {
      WS.send(JSON.stringify({ 'newManagerConnection': $operator.email, 'msg': 'initial connection...', 'date': Date.now() }));
    }
  }

  onMount(() => {
    let { hostname, protocol : httpPrefix } = window.location;
    let wsPrefix = httpPrefix === 'http:' ? 'ws:' : 'wss:';
    WS_URL = `${wsPrefix}//${hostname}:5001/ws`;
  })

  $: if ($isAuthorized && WS_URL) initWS();
</script>

<Clients/>
<div class="chat">
  <Messages/>
  <MessageInput />
</div>
<Templates/>

<style>
  .chat {
    flex: 1 1 45%;
    height: 100%;
    background: #666;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    position: relative;
  }
</style>
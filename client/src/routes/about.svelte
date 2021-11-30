<script>
  import Clients from '../components/Clients.svelte';
  import Messages from '../components/Messages.svelte';
  import Templates from '../components/Templates.svelte';
  import MessageInput from '../components/MessageInput.svelte';
  import { onMount} from 'svelte';
  import { isAuthorized, operator, clients, url, ws } from '../store/store';

  let WS_URL;

  const initWS = () => {
    $ws = new WebSocket(WS_URL + '?userName=' + $operator.email);

    console.log('init WebSocket', $ws);

    $ws.onmessage = (msg) => {
      let data = JSON.parse(msg.data);
      console.log('received message from', data);
      clients.modify(data);
    }

    $ws.onopen = () => {
      $ws.send(JSON.stringify({ 'newManagerConnection': $operator.email, 'msg': 'initial connection...', 'date': Date.now() }));
    }
  }

  onMount(() => {
    let { hostname, protocol : httpPrefix } = window.location;
    let wsPrefix = httpPrefix === 'http:' ? 'ws:' : 'wss:';
    WS_URL = `${wsPrefix}//${hostname}:5001/ws`;
    $url = `${httpPrefix}//${hostname}:5001`
  })

  $: if ($isAuthorized && WS_URL) initWS();
</script>

<Clients/>
<div class="chat">
  <Messages/>
  <MessageInput />
</div>
<Templates/>

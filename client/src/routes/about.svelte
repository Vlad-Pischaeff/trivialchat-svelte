<script>
  import Clients from '../components/Clients.svelte';
  import Messages from '../components/Messages.svelte';
  import Templates from '../components/Templates.svelte';
  import MessageInput from '../components/MessageInput.svelte';
  import { wsInitialized } from '../store/wstore';

  $: console.log('WebSocket initialized...', $wsInitialized);
</script>

  <Clients/>
  <div class="chat">
    <Messages/>
    <MessageInput />
  </div>
  <Templates/>

<script>
  import Clients from '../components/Clients.svelte';
  import Messages from '../components/Messages.svelte';
  import Templates from '../components/Templates.svelte';
  import MessageInput from '../components/MessageInput.svelte';
  import { wsInitialized } from '../store/wstore';
  import { setGreenIndicator } from '../store/store';

  $: $setGreenIndicator = $wsInitialized;
</script>

  <Clients/>
  <div class="chat">
    <Messages/>
    <MessageInput />
  </div>
  <Templates/>

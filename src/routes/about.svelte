<script>
  import Clients from '../components/Clients.svelte';
  import Messages from '../components/Messages.svelte';
  import Templates from '../components/Templates.svelte';
  import MessageInput from '../components/MessageInput.svelte';
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
<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
	import { isAuthorized } from "../store/store";
  import Clients from '../components/Clients.svelte';
  import Messages from '../components/Messages.svelte';
  import Templates from '../components/Templates.svelte';
  import MessageInput from '../components/MessageInput.svelte';


  const routeToPage = (route, replaceState = true) => goto(`/${route}`, { replaceState });

  onMount(() => {
    if (!$isAuthorized) routeToPage('');

    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(function(result) {
        console.log('Notification permission...', result);
      });
    }
  });

</script>

{#if false}<slot/>{/if}

{#if $isAuthorized}
  <Clients/>
  <div class="chat">
    <Messages/>
    <MessageInput />
  </div>
  <Templates/>
{/if}

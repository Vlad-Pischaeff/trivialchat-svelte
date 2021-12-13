<script>
  import { selectedUserIdx, clients } from '../store/store';
  import Message from './Message.svelte';

  let messages = [], msgRef;

  $: if (msgRef && messages) msgRef.scrollIntoView({ behavior: 'smooth' }); 
  $: ($selectedUserIdx === null) 
        ? messages = []
        : messages = $clients[$selectedUserIdx]?.msgarr;
</script>

<div class="chat_field">
  {#if (messages.length === 0)}
    <div class="no-msg">No messages...</div>
  {:else}
    {#each messages as message, idx}  
      <div class="chat_field-message" data-align={message.msg1 ? 'from': 'to'} bind:this={msgRef}>
        <Message item={message} />
      </div>
    {/each}
  {/if}
</div>

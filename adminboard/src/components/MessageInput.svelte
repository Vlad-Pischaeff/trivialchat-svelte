<script>
  import { onMount } from 'svelte';
  import { selectedUserIdx, clients } from '../store/store';
  import { wstore, wsInitialized } from '../store/wstore';
  import { tooltip } from '../js/__Tooltip';

  let message, messageInput;

  const sendMessage = () => {
    if (message && $selectedUserIdx !== null) {
      clients.reply(message, $selectedUserIdx);
      wstore.sendMessage(message);
    }
    message = '';
  }

  const onKeyPress = e => { if (e.charCode === 13) sendMessage(); };

  onMount(() => messageInput.focus());
  
  $: if ($wsInitialized) console.log('ws ON...');
</script>

<div class="chat_input">
  <input  class="chat_input-text" 
          name="message" 
          type="text" 
          placeholder="type your answer here ..." 
          required 
          bind:this={messageInput}
          bind:value={message} on:keypress={onKeyPress}/>

    <img  class="w-icon" alt='Send message' on:click={sendMessage} use:tooltip title='Send message'
          src="data:image/png;base64,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" 
    />
</div>

<style>
  .chat_input {
    background: #454545;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: .5rem;
    width: 100%;
  }
  .chat_input-text {
    flex: 1 1 auto;
    height: 2.6rem;
    border: none;
    color: black;
    font-family: Esqadero;
    font-size: 1.1rem;
    font-weight: 200;
    padding: 0 .5rem 0 .5rem;
    margin-right: .5rem;
    background: #454545;
    width: 80%;
  }
  .chat_input-text::placeholder {
    font-size: 1rem;
  }
  .chat_input-text:focus {
    outline: none;
    background: azure;
  }
</style>
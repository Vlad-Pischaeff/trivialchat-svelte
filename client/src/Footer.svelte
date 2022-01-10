<script>
  import { iconOK } from './icons';

  export let inputVal = '';

  export let sendMessage = () => {};

  const onClick = () => {
    if (inputVal !== '') { 
      sendMessage(inputVal);
      inputVal  = '';
    }
  }

  const onKeyPress = e => { if (e.charCode === 13) onClick() };

</script>

<footer class="cp_footer">
  <div class="chat_input">
    <input 	class="chat_input-text" name="question" bind:value={inputVal} 
            type="text" 
            placeholder="type your question ..."
            on:keypress={onKeyPress}>
    <img 	class="chat_input-icon" src={iconOK} alt="OK" 
          on:click={onClick} />
  </div>
</footer>
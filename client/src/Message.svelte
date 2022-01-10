<script>
  export let message;
  let msgRef;

  $: if (msgRef) msgRef.scrollIntoView({ behavior: 'smooth' });
</script>

<div  class="chat_field-message" 
      data-align="{message.from ? 'from' : 'to'}" 
      bind:this={msgRef}>
  <div class="{message.from ? 'chat_field-messagefrom' : 'chat_field-messageto'}">
    <p class="msg-data">{ new Date(message.date).toLocaleString()}</p>
    <p class="msg-text">{message.msg}</p>
  </div>
</div>
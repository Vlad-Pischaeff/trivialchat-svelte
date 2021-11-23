<script>
  let messages = [];
</script>

<div class="chat_field">
  {#if messages.length === 0}
    <div class="messages-empty">No messages...</div>
  {:else}
    messages.map((item, idx) => (
          <div  key={idx} 
                class="chat_field-message"
                data-align={item.msg1 ? 'from': 'to'} >
            <Message item={item} />
          </div>
        ))
  {/if}
</div>

<style>
  .chat_field {
    padding: 1rem;
    overflow: auto;  
  }
  .messages-empty {
    color: #bbb;
  }
</style>
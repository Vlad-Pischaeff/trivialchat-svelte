<script>
  export let item;
</script>

<article class={item.msg1 ? 'chat_field-messagefrom' : 'chat_field-messageto'} >
  <div class="msg-data">{new Date(item.date).toLocaleString()}</div>
  <div class="msg-text">{item.msg1 ? item.msg1 : item.msg0}</div>
</article>
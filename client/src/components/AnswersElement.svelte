<script>
  import { tick } from 'svelte';
  import { operator, ws, clients, selectedUserIdx } from '../store/store';
  import ButtonEdit from './ButtonEdit.svelte';
  import ButtonSave from './ButtonSave.svelte';
  import ButtonDelete from './ButtonDelete.svelte';
  import ButtonSend from './ButtonSend.svelte';

  export let item, index;
  let isEditable = false;
  let refAnswer;

  const sendMessage = ()  => {
    clients.reply(item);
    $ws.send(JSON.stringify({ 'to': $clients[$selectedUserIdx]['user'], 'msg': item, 'date': Date.now() }));
  };
  
  const saveAnswer = ()  => {
    isEditable = false;
    operator.setAnswer(refAnswer.innerText, index);
  };

  const deleteAnswer = ()  => operator.delAnswer(index);
  
  const editAnswer = async () => {
    isEditable = true;
    await tick();
    refAnswer.focus();
  };

  const onKeyPress = e => { if (e.charCode === 13) saveAnswer(); };

</script>

<div class="templates_body-item">

  <ButtonSend handlerClick={sendMessage}/>

  <div class="templates_body-itemtext">
    <p contenteditable={isEditable} bind:this={refAnswer} on:keypress={onKeyPress}>
      {item}
    </p>
  </div>

  {#if isEditable}
    <ButtonSave handlerClick={saveAnswer}/>  
  {:else}
    <ButtonEdit handlerClick={editAnswer}/> 
  {/if}

  <ButtonDelete handlerClick={deleteAnswer}/> 

</div>
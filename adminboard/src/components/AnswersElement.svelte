<script>
  import { tick } from 'svelte';
  import { operator, clients, selectedUserIdx } from '../store/store';
  import { wstore } from '../store/wstore';
  import ButtonEdit from './ButtonEdit.svelte';
  import ButtonSave from './ButtonSave.svelte';
  import ButtonDelete from './ButtonDelete.svelte';
  import ButtonSend from './ButtonSend.svelte';

  export let item, index;
  let isEditable = false;
  let refAnswer;

  const sendMessage = ()  => {
    if ($selectedUserIdx !== null) {
      clients.reply(item, $selectedUserIdx);
      wstore.sendMessage(item);
    }
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

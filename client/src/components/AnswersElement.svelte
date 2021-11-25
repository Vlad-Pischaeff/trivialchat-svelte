<script>
  import { tick } from 'svelte';
  import { operator } from '../store/store';
  import ButtonEdit from './ButtonEdit.svelte';
  import ButtonSave from './ButtonSave.svelte';
  import ButtonDelete from './ButtonDelete.svelte';
  import ButtonSend from './ButtonSend.svelte';

  export let item, index;
  let isEditable = false;
  let refAnswer, refView;

  const sendMessage = ()  => {};
  
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

  // $: if (refView) {
  //     if (index === ($operator.answer.length - 2)) refView.scrollIntoView({behavior: "smooth"})
  //   }

</script>

<div class="templates_body-item">

  <ButtonSend handlerClick={sendMessage}/>

  <div class="templates_body-itemtext">
    {#if isEditable} 
      <p contenteditable=true bind:this={refAnswer} on:keypress={onKeyPress}>
        {item}
      </p>
    {:else}
      <p contenteditable=false bind:this={refView}>{item}</p>
    {/if}
  </div>

  {#if isEditable}
    <ButtonSave handlerClick={saveAnswer}/>  
  {:else}
    <ButtonEdit handlerClick={editAnswer}/> 
  {/if}

  <ButtonDelete handlerClick={deleteAnswer}/> 

</div>
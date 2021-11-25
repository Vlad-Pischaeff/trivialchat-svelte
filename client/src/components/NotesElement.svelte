<script>
  import { tick } from 'svelte';
  import { operator } from '../store/store';
  import ButtonSave from './ButtonSave.svelte';
  import ButtonEdit from './ButtonEdit.svelte';
  import ButtonDelete from './ButtonDelete.svelte';

  export let item, index;
  let isEditable = false;
  let refNote, refView;

  const saveNote = ()  => {
    isEditable = false;
    operator.setNote(refNote.innerText, index);
  };

  const deleteNote = ()  => {
    operator.delNote(index);
    isEditable = false;
  }
  
  const editNote = async () => {
    isEditable = true;
    await tick();
    refNote.focus();
  };

  const onKeyPress = e => { if (e.charCode === 13) saveNote(); };
  
  $: if (refView) {
      if (index === ($operator.notes.length - 2)) refView.scrollIntoView({behavior: "smooth"})
    }
</script>

<div class="templates_body-item">

  <div class="templates_body-itemtext">
    {#if isEditable} 
      <p contenteditable=true bind:this={refNote} on:keypress={onKeyPress}>
        {item}
      </p>
    {:else}
      <p contenteditable=false bind:this={refView}>{item}</p>
    {/if}
  </div>

  {#if isEditable}
    <ButtonSave handlerClick={saveNote}/>
  {:else}
    <ButtonEdit handlerClick={editNote}/>
  {/if}

  <ButtonDelete handlerClick={deleteNote}/>
</div>
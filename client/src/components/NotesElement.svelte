<script>
  import { tick } from 'svelte';
  import { operator } from '../store/store';
  import ButtonSave from './ButtonSave.svelte';
  import ButtonEdit from './ButtonEdit.svelte';
  import ButtonDelete from './ButtonDelete.svelte';

  export let item, index;
  let isEditable = false;
  let refNote;

  const saveNote = ()  => {
    isEditable = false;
    operator.setNote(refNote.innerText, index);
  };

  const deleteNote = ()  => {
    isEditable = false;
    operator.delNote(index);
  }
  
  const editNote = async () => {
    isEditable = true;
    await tick();
    refNote.focus();
  };

  const onKeyPress = e => { if (e.charCode === 13) saveNote(); };
  
</script>

<div class="templates_body-item">

  <div class="templates_body-itemtext">
    <p contenteditable={isEditable} bind:this={refNote} on:keypress={onKeyPress}>
      {item}
    </p>
  </div>

  {#if isEditable}
    <ButtonSave handlerClick={saveNote}/>
  {:else}
    <ButtonEdit handlerClick={editNote}/>
  {/if}

  <ButtonDelete handlerClick={deleteNote}/>
</div>
<script>
  import { tick } from 'svelte';
  import { operator, scrollList } from '../store/store';
  import NotesElement from './NotesElement.svelte';

  let notes, notesRef, timerId;
  
  function noteObject(text) {
    this.id = {};
    this.text = text;
  };

  const updateNotes = async () => {
    await tick();
    notes = $operator.notes.map(n => new noteObject(n));
  };

  $: if ($operator.notes) updateNotes();

  $: if (!$scrollList) clearTimeout(timerId);

  $: if (notesRef && $scrollList) {
      notesRef.scrollIntoView({ behavior: 'smooth'});
      timerId = setTimeout(() => $scrollList = false, 500);
    };
</script>

{#if (notes && notes.length !== 0) }

  {#each notes as note, idx (note.id)}
    <div class="templates_body-item" bind:this={notesRef}>
      <NotesElement item={note.text} index={idx} />
    </div>
  {/each}

{:else}

    <div class="warning">You have no more notes...</div>
    <div class="warning">Click (+) button below to add new note...</div>

{/if}

<style>
  .warning {
    color: #ddd;
  }
</style>



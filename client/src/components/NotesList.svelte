<script>
  import { tick } from 'svelte';
  import { operator, scrollList } from '../store/store';
  import NotesElement from './NotesElement.svelte';

  let notes, notesRef, timerId;
  
  const updateNotes = async () => {
    await tick();
    notes = $operator.notes;
    // console.log('notes...',notes, notesRef);
  }

  $: if ($operator.notes) updateNotes();

  $: if (!$scrollList) clearTimeout(timerId);

  $: if (notesRef && $scrollList) {
      notesRef.scrollIntoView({ behavior: 'smooth'});
      timerId = setTimeout(() => $scrollList = false, 500);
    }
</script>

{#if (notes && notes.length !== 0) }

  {#each notes as note, idx }
    <div class="templates_body-item" bind:this={notesRef}>
      <NotesElement item={note} index={idx} />
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



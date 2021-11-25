<script>
  import { operator } from '../store/store';
  import NotesElement from './NotesElement.svelte';

  let notes;

  $: {
    notes = $operator.notes;
    // console.log('notes...', notes);
  }
</script>

{#if notes.length !== 0 }

  {#each notes as note, idx }
    <NotesElement item={note} index={idx} />
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



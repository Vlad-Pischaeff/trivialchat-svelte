<script>
  import { operator } from '../store/store';
  import AnswerElement from './AnswersElement.svelte';

  let answers;

  $: answers = $operator.answer;
</script>

{#if answers.length !== 0 }

  {#each answers as answer, idx }
    <AnswerElement item={answer} index={idx} />
  {/each}

{:else}

    <div class="warning">You have no more quick answers...</div>
    <div class="warning">Click (+) button below to add new answer...</div>

{/if}

<style>
  .warning {
    color: #ddd;
  }
</style>
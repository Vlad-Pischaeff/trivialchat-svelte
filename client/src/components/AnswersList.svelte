<script>
  import { tick } from 'svelte';
  import { operator, scrollList } from '../store/store';
  import AnswerElement from './AnswersElement.svelte';

  let answers, answersRef, timerId;
  
  const updateAnswers = async () => {
    await tick();
    answers = $operator.answer;
  };

  $: if ($operator.answer) updateAnswers();
  
  $: if (!$scrollList) clearTimeout(timerId);

  $: if (answersRef && $scrollList) {
      answersRef.scrollIntoView({ behavior: 'smooth'});
      timerId = setTimeout(() => $scrollList = false, 500);
    }
  // $: answers = $operator.answer;
</script>

{#if (answers && answers.length !== 0) }

  {#each answers as answer, idx }
    <div class="templates_body-item" bind:this={answersRef}>
      <AnswerElement item={answer} index={idx} />
    </div>
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
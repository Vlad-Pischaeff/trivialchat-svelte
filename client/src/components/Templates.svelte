<script>
  import TemplatesHeader from "./TemplatesHeader.svelte";
  import TemplatesFooter from './TemplatesFooter.svelte';
  import NotesList from './NotesList.svelte';
  import AnswersList from './AnswersList.svelte';

  let index;
  let component = [AnswersList, NotesList]

</script>

<aside class="templates">
  <TemplatesHeader bind:idx={index}/>
  <section class="templates_body">
    <div class="content">
      <svelte:component this={component[index]} />
    </div>
  </section>
  <TemplatesFooter idx={index}/>
</aside>

<style>
  .content {
    margin: .5rem;
  }
</style>
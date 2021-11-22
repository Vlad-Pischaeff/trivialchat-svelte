<script>
  import TemplatesHeader from "./TemplatesHeader.svelte";
  import TemplatesFooter from './TemplatesFooter.svelte';
  let value;
</script>

<aside class="templates">
  <TemplatesHeader bind:idx={value}/>
  <section class="templates_body">
    <div class="no_templates">
      <!-- { body[idx] } -->
      {value}

    </div>
  </section>
  <TemplatesFooter/>
</aside>

<style>
  .no_templates {
    margin: .5rem;
  }
</style>
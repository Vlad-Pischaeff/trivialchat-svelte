<script>
  import TemplatesHeader from "./TemplatesHeader.svelte";
  import TemplatesFooter from './TemplatesFooter.svelte';
  let value;
</script>

<aside class="templates">
  <TemplatesHeader bind:idx={value}/>
  <section class="templates_body">
    <div>
      <!-- { body[idx] } -->
      {value}

    </div>
  </section>
  <TemplatesFooter/>
</aside>

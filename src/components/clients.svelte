<script>
  import Client from './client.svelte';
  let clients = [];
</script>

<div class="clients">
  {#if clients.length === 0}
    <div class="client-empty">No clients...</div>
  {:else}
    clients.map((n, i) => <Client n={n} i={i} key={i} />)
  {/if}
</div>

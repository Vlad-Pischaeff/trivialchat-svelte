<script>
  import { clients } from '../store/store';
  import Client from './Client.svelte';
  let currentClients;

  $: currentClients = $clients;
</script>

<div class="clients">
  {#if currentClients.length === 0}
    <div class="client-empty">No clients...</div>
  {:else}
    {#each currentClients as client, i }
      <Client item={client} index={i} />
    {/each}
  {/if}
</div>

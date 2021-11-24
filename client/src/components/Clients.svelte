<script>
  import { clients } from '../store/store';
  import Client from './Client.svelte';
</script>

<div class="clients">
  {#if $clients.length === 0}
    <div class="client-empty">No clients...</div>
  {:else}
    {#each $clients as client, i }
      <Client item={client} index={i} />
    {/each}
  {/if}
</div>

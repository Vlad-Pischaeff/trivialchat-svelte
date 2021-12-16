<script>
  import { clients, operator } from '../store/store';
  import Client from './Client.svelte';
  let currentClients;
  // const { email } = $operator;

  function clientObject(item) {
    this.id = {};
    this.item = item;
  }

  $: currentClients = $clients.map(n => new clientObject(n));
  // $: {
  //   currentClients = $mainStore[email].map(n => new clientObject(n));
  //   console.log('currentClients...', $mainStore, $mainStore[email], currentClients);
  //   }
</script>

<div class="clients">
  {#if currentClients.length === 0}
    <div class="client-empty">No clients...</div>
  {:else}
    {#each currentClients as client, i (client.id)}
      <Client item={client.item} index={i} />
    {/each}
  {/if}
</div>

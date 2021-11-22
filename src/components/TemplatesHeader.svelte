<script>
  const tabs = [
                  { 'tip': "Quick short answers...", 'icon': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAvCAYAAAClgknJAAAACXBIWXMAAC4jAAAuIwF4pT92AAADkElEQVR4nO2Z0UsUQRzHZ/b29O48Tgx8EEIqCoR6qceKBJHoqScLfPAhKBMkDJKoyPRMH8RISqOkXoIiiB57iMCXrF56CIKoPyDq4Ur0OL3z3N1f37nV9fS8vbndvTvF+8LOjPubmf38dmZ+M7eqzDAmGWM9jHOV7SQRaUifCOidBy8kmIl6VAueKIH0Z2WppNUC7rBgz37z34jzExVDKkKc6BOy46K886bOJlUdqLSqDlRa0g7weHwPW15OU2NjIsc2NxdhgUDIU7KFhTg1NS0VqiblAMLWQxaJXBG7H9f1TvL53lg2w+hmDQ2PEZMVN7w5CgaX8ayzeNZ7u2qyI3A6k4pNT1HaULIcwL12z+HNfmvxrFaUPHDAMHrRWS9Ki5hGY5gu67aVlUHm9+sohZ3Tbqm/LJmcZCH7mSnlAIZxBtlM5o9seGGrqfmBrNMRYiEVgBfaPVFou2p3OIBQeQlRoR/FJabr3aSqXyybrrdhgT9g3i/iGNO0C+T3f7erJDcCnF/HdTBT9vkuIrUcyEQnzo8458yrfUxVu5DfsKsk5wCReMM3mTkCz1n2zwjDeAonjrHSjMArhGjbSnJhVFGmkE2ZLTY2QYh9h2y/I8RCKgCfwSnJg8uoqgOVllwY1bRTiD49TJyFUqkoBYO/LFs6fQhz9RYrxVlocfEOhcMxu0pyI+DzTSNUtmTKgUAaaa9l8/tHYDvvnNNGdXX/kN62qyI7hT4w8S2GyMD1EcDrFiJhO4d7PF9jRyJaQYj+jJdnW00ujHJ+mSeTURydUxSJzG2wKcojnki8xkjUucDNVSo1T/X184WqSS9izPvf+JW0tc2cp7ZztWjV1kpV2x1RaDur6kClle3AXpz7bWNullKIEi8pFPpjVynzyYXzLub9izq8VljvmPNmXHeluwgG25GeyWcGfD+O2eMOAeVEpIn/cnwF+FEHzZvzGcoEbyB9prJ4vI2FwyeZ7DArygs4nHfTAvy1DfBiWs7OjrnlzVEsRtTRoauru91b2XZcbPH5bCb8PeuGYQxgpx5lra3uYG3k2eIC/NVN8IOAH/Gq/3zyxIFV+AnrhmEMAX7Yi74LybUDgO/Dmrhv3TDho277lZUrB1bhJ6yjNFG0nPBCbhw4sAl+GMfuIU+oipBzB8T3+zURjQB+0AugYuV+ERONAn7AAxZHcuKAZpVMeNnzU0nkxIFpgPfhGi9XqLTTfwTgFl4JPrUiAAAAAElFTkSuQmCC' },
                  { 'tip': "Your notes...", 'icon': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAwCAYAAABjezibAAAACXBIWXMAAC4jAAAuIwF4pT92AAAC9klEQVR4nO2ZP2gTURzHf+9yJWnSkOaqJlDUoYrQEMFBB2kbN8EuQjI4OIi4OCgoFAVtO1gErVIcdHDRwUVoh+Din8EWXJykxLEKilBipTSxkYYm7+fvXTzN6V1i/tyfQL5web87fvfuw7v3+17ungyc3wCACWDMC24SYpF+Z2VwI5yQYEKckF0Jp4nYZN2B9fUQZDI/HMKpKB73g6LktF09YLFYwkSiZDtUldjqqu76slmiW9S5gGxtrQ/C4TiFHouuXYZc7j0ODHyvlWQIyFZWvDA09I6qaJ81bL+kKJ9YNhvDSKRglmI8goODOy2HE2JsL/T3Ryn6YJZiCIi9vV8Y55epgyRYd4s5GXEavV5TOCHTOYiSNEfNXNuxqsVY3ZTOrWK3qHMB2ebmDvD5YjRP6k+UZoRYhnx+GRUlXyvN2Ae3tnZDIJAhuJAlcJrC4c/kg8ON+2BPz37L4YQY20M+GKHoo1mKMeDMzCJMTd2i6Kjoxho61QefkQ+awgkZG/X0NKfmqiVY1er6oA3qXEA2P++B8XFRYVJDPXK+DcHgV+QcW4UTMvbBbDYAyeRbmsSxpnotlxfoN9UKmCbjEVSUA03DVXSSLS3J7XgBMwZMp5dpBB9RdBwavcUA2+RvD9r1dmjsg6lUmZqzTffaxsd351axW9QFbFVdwFZlG6Awbhgbu0vhkZqJ0ajOd+0bwZGRE+SPFxs9zT7AZl4hELkzcxBxkf5QTOqOMeYHSbpDbbwqb9KpIvmGsvxG22EbGyEIhZ7r4Di/hpJ00/EqZvl8mOBeENzh3wc5v0Jwt0XoKKD6cSAYfElwh9QDiEjbJYK7p+U4BsgKhV0QCLwiuINVcBcI7n51nlOAPvD7XxPcsLpH1UrbeYJ7+HeiU4DHCK5PjcQ3GsRzBPfYKFEP6PXKquNbodHRP08IPdwZgntidpoeRqzwJBKW8P0jxBJtpwnuaa00WV1VtHu9ThQE56fQ41molypGcFasKtoGWSmI6/8DJ/QTVz/ipRqlzqgAAAAASUVORK5CYII=' },
                ]
  export let idx = 0;

  // $: console.log('tabs...', idx);
</script>

<section class="templates_header">
  {#each tabs as tab, i}
    <div class={idx === i ? "tab tab-selected" : "tab"}>
      <img class={idx === i ? "b-icon" : "w-icon"} src={tab.icon} alt='answers' on:click={() => idx = i}/>
    </div>
  {/each}
</section>

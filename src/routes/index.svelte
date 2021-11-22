<script>
  import Cardlogin from '../components/CardLogin.svelte'
  import Carddescription from '../components/CardDescription.svelte';
  import Cardsignup from '../components/CardSignup.svelte';
</script>

<Carddescription/>

<div class="card_wrap">
  <Cardlogin/>
  <Cardsignup/>
</div>


<style>
  .card_wrap {
    flex: 1 1 60%;
    height: 80%;
    max-height: 25rem;
    min-height: 21rem;
    margin-right: 2rem;
    perspective: 300rem;
    perspective-origin: 50% 50%;
    transform-style: preserve-3d;
  }
</style>
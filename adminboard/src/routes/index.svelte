<script>
  import Cardlogin from '../components/CardLogin.svelte'
  import Carddescription from '../components/CardDescription.svelte';
  import Cardsignup from '../components/CardSignup.svelte';
  import AuthErrors from '../components/AuthErrors.svelte';
  import { isAuthorized } from '../store/store';

  let opacity;

  $: opacity = $isAuthorized ? 0 : 1;

</script>

<section class="auth" style="opacity: {opacity};">
  <Carddescription/>

  <div class="card_wrap">
    <Cardlogin/>
    <Cardsignup/>
  </div>
  <AuthErrors/>
</section>

<style>
  .auth {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    transition: opacity 1s ease-in-out;
  }
</style>
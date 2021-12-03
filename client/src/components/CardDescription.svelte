<script>
  import { switchToLogin } from '../store/store';
  let triggerAnimation = false;

  const handleClick = () => {
    $switchToLogin = !$switchToLogin;
    triggerAnimation = true;
  }

  const handleAnimEnd = () => triggerAnimation = false;
</script>

<div class="description_form">
  <h2 class="description_form-title" class:fromshadow={triggerAnimation} on:animationend={handleAnimEnd}>
    {#if $switchToLogin}
      Don't have an account yet?
    {:else}
      Already have an account?
    {/if}
  </h2>
  <p class="description_form-text">Banjo tote bag bicycle rights, High Life sartorial cray craft beer whatever street art fap.</p>
  <button class="description_form-button" on:click={handleClick}>
    {#if $switchToLogin}
      Sign up
    {:else}
      Log in
    {/if}
  </button>
</div>

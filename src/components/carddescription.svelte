<script>
  let toLogin = true
  let triggerAnimation = false

  function handleClick() {
    toLogin = !toLogin
    triggerAnimation = true
  }

  function handleAnimEnd() {
    triggerAnimation = false
  }
</script>

<div class="description_form">
  <h2 class="description_form-title" class:fromshadow={triggerAnimation} on:animationend={handleAnimEnd}>
    {#if toLogin}
      Don't have an account yet?
    {:else}
      Already have an account?
    {/if}
  </h2>
  <p class="description_form-text">Banjo tote bag bicycle rights, High Life sartorial cray craft beer whatever street art fap.</p>
  <button class="description_form-button" id="switch-button" on:click={handleClick}>
    {#if toLogin}
      Sign up
    {:else}
      Log in
    {/if}
  </button>
</div>

<style>
.description_form {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  align-items: center;
  background: lightblue;
  border-radius: .3rem;
  height: 60%;
  min-height: 15rem;
  width: 35%;
  padding: 1rem;
}
.description_form-title {
  font-family: Esqadero;
  font-weight: 300;
  color: gray;
}
.description_form-text {
  color: #222;
  line-height: 1.2rem;
}
.description_form-button {
  font-family: Esqadero;
  font-size: .9rem;
  text-transform: uppercase;
  letter-spacing: .2rem;
  color: deeppink;
  background: transparent;
  padding: .6rem;
  border-radius: .2rem;
  border: 1px solid gray;
  width: 100%;
}
.description_form-button:hover {
  background: gray;
  color: white;
  cursor: pointer;
}
.fromshadow {
  animation: shadow .5s ease-in-out;
}
@keyframes shadow {
  from {
    color: transparent;
    text-shadow: 0 0 25px gray;
  }
}
</style>
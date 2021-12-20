<script>
  import { switchToLogin, operator, authErrors } from '../store/store';

  let email, password;

  const handlerClick = () => operator.login({ email, password });

  const focusEmail = () => email = null;

  const focusPassword = () => password = null;
  
  $: if (!email || !password) $authErrors = [];
</script>

<div class="card {$switchToLogin ? "flip0" : "flip180"}">
  <form class="card_form" autoComplete="off" on:submit|preventDefault={handlerClick}>

    <h2 class="card_form-title" style="align-self: flex-start">Login</h2>

    <fieldset class="card_form-fieldset">
        <input  class="card_form-input" 
                type="email" 
                name="email" 
                placeholder="Email" 
                required on:focus={focusEmail}
                bind:value={email} />

        <input  class="card_form-input" 
                type="password" 
                name="password" 
                placeholder="Password" 
                required on:focus={focusPassword}
                bind:value={password} />
    </fieldset>

    <div class="card_form-buttons">
      <p class="card_form-forgot">Forgot password?..</p>
      <input class="card_form-submit" type="submit" value="login"/>
    </div>

    <div class="card_form-warnings">
      <!-- {#each $authErrors as error }
        <p class="card_form-warning">{error.msg}</p>
      {/each} -->
    </div>
  </form>
</div>

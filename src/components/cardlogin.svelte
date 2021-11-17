<script>
  import { switchToLogin, isAuthorized } from '../store/store';
  let email;
  let password;

  function validate() {
    $isAuthorized = true;
  }

</script>

<div class="card {$switchToLogin ? "flip0" : "flip180"}">
  <form class="card_form" autoComplete="off" on:submit|preventDefault={validate}>

    <h2 class="card_form-title">Login</h2>

    <fieldset class="card_form-fieldset">
        <input  class="card_form-input" 
                type="email" 
                name="email" 
                placeholder="Email" 
                required
                bind:value={email} />

        <input  class="card_form-input" 
                type="password" 
                name="password" 
                placeholder="Password" 
                required
                bind:value={password} />
    </fieldset>

    <div class="card_form-buttons">
      <p class="card_form-forgot">Forgot password?..</p>
      <input class="card_form-submit" type="submit" value="login"/>
    </div>

    <div class="card_form-warnings">
      <p class="card_form-warning">Warning 1</p>
      <p class="card_form-warning">Warning 2</p>
      <p class="card_form-warning">Warning 3</p>
    </div>
  </form>
</div>

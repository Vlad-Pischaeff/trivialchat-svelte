<script>
  import { switchToLogin, isAuthorized } from '../store/store'
  let email;
  let password;

  function validate() {
    $isAuthorized = true;
  }
  // $: {
  //   console.log('email...', email, 'password...', password, 'switchToLogin...', $switchToLogin)
  // }
</script>

<div class="card {$switchToLogin ? "flip-180" : "flip0"} ">
  <form class="card_form" autoComplete="off" on:submit|preventDefault={validate}>

    <h2 class="card_form-title">Signup</h2>

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
      <!-- <p class="card_form-forgot">Forgot password?..</p> -->
      <input class="card_form-submit" type="submit" value="signup"/>
    </div>

    <div class="card_form-warnings">
      <p class="card_form-warning">Warning 1</p>
      <p class="card_form-warning">Warning 2</p>
    </div>
  </form>
</div>

<style>
  
</style>
<script>
  let email;
  let password;
  $: {
    console.log('email...', email, 'password...', password)
  }
</script>

<div class="card">
  <form class="card_form" autoComplete="off" >

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
      <textarea class="card_form-button" value="Forgot password?.."/>
      <input class="card_form-submit" type="submit" value="login"/>
    </div>

    <div class="card_form-warnings">
      <p class="card_form-warning">Warning 1</p>
      <p class="card_form-warning">Warning 2</p>
    </div>
  </form>
</div>

<style>
.card {
  background: white;
  border-radius: .3rem;
  padding: 1rem;
  height: 80%;
  width: 50%;
  min-height: 21rem;
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.25);
}
.card_form {
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
}
.card_form-title {
  font-family: Esqadero;
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: .2rem;
  color: deeppink;
}
.card_form-fieldset {
  border: none;
  border-radius: .3rem;
  margin: 1rem 0;
  padding: 1rem;
  background: oldlace;
}
.card_form-input {
  font-family: Esqadero;
  font-size: 1.2rem;
  letter-spacing: .1rem;
  color: black;
  background: transparent;
  padding: .3rem;
  margin: .5rem 0;
  border-bottom: 1px solid #888;
  border-top: none;
  border-left: none;
  border-right: none;
  width: 100%;
}
.card_form-input:focus {
  border-bottom: 2px solid #888;
  border-top: none;
  border-left: none;
  border-right: none;
  outline: none;
}
.card_form-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.card_form-submit {
  /* width: 30%; */
  /* min-width: 9rem; */
  font-family: Esqadero;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: .2rem;
  padding: 1rem;
  color: deeppink;
  background: lightblue;
  border: none;
  border-radius: .2rem;
}
.card_form-submit:hover {
  color: lightblue;
  background: deeppink;
  cursor: pointer;
}
.card_form-button {
  /* width: 40%; */
  min-width: 6rem;
  font-family: Esqadero;
  font-size: .7rem;
  color: gray;
  border: none;
  padding-left: 1rem;
  resize: none;
}
.card_form-button:hover {
  color: black;
  font-weight: 600;
  cursor: pointer;
}
.card_form-button:focus {
  border: none;
  outline: none;
}
.card_form-warnings {
  width: 100%;
  height: 4rem;
  background: aliceblue;
}
.card_form-warning {
  /* text-transform: uppercase; */
  padding-left: .5rem;
  margin-bottom: .1rem; 
  background-color: deeppink;
}
</style>
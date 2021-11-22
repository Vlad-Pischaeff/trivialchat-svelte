<script>
  import ButtonClose from './ButtonClose.svelte';
  import { modalAction } from '../store/store';

  let address;

  const closeModal = () => {
    $modalAction = null;
  }

  const updateProfile = () => {

  }
</script>

<div class="modal_bg">
  <section  class="modal_form">

    <form class="forms_wrap" autoComplete="off" on:submit|preventDefault={updateProfile}>
      <section class="forms_header">
        <h2 class="forms_title">Set site web address for USER...</h2>
        <ButtonClose handlerClose={closeModal} />
      </section>

      <fieldset class="card_form-fieldset">  
        <input  class="card_form-input" 
                type="text" 
                name="address" 
                placeholder="www.mysite.com" 
                required
                bind:value={address} />
      </fieldset>

      <hr>
      <div>
        <input class="card_form-submit" type="submit" value="save"/>
      </div>
    </form>
  </section>
</div>


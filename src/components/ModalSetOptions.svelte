<script>
  import ButtonClose from './ButtonClose.svelte';
  import { modalAction } from '../store/store';

  let org, title, address;

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
        <h2 class="forms_title">Set Your organisation...</h2>
        <ButtonClose handlerClose={closeModal} />
      </section>

      <fieldset class="card_form-fieldset">
        <input  class="card_form-input" 
                type="text" 
                name="org" 
                placeholder="Fake Corp." 
                required
                bind:value={org} />
        <input  class="card_form-input" 
                type="text" 
                name="title" 
                placeholder="Manager" 
                required
                bind:value={title} />  
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


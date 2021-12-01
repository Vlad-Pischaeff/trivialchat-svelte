<script>
  import { operator, modalAction } from "../store/store";
  import ButtonClose from './ButtonClose.svelte';

  let site;

  const closeModal = () => {
    $modalAction = null;
  }

  const updateProfile = async () => {
    operator.modify({ site });
    closeModal();
  }

  const initValues = () => {
    site = $operator.site;
  }

  $: if ($operator) initValues();
</script>

<div class="modal_bg">
  <section  class="modal_form" style="width: 60%">

    <form class="forms" autoComplete="off" on:submit|preventDefault={updateProfile}>
      <section class="forms_header">
        <h2 class="forms_title">Your site web address...</h2>
        <ButtonClose handlerClose={closeModal} />
      </section>

      <fieldset class="card_form-fieldset">  
        <input  class="card_form-input" 
                type="text" 
                name="site" 
                placeholder="www.mysite.com" 
                required
                bind:value={site} />
      </fieldset>

      <!-- <hr> -->
      <div>
        <input class="card_form-submit" type="submit" value="save"/>
      </div>
    </form>
  </section>
</div>


<script>
  import { operator, modalAction } from "../store/store";
  import ButtonClose from './ButtonClose.svelte';

  let title, desc, site, greeting;

  const closeModal = () => $modalAction = null;

  const updateProfile = async () => {
    operator.modify({ title, desc, site, greeting });
    closeModal();
  }

  const initValues = () => {
    title = $operator.title;
    desc = $operator.desc;
    site = $operator.site;
    greeting = $operator.greeting;
  }

  $: if ($operator) initValues();
</script>

<div class="modal_bg">
  <section  class="modal_form" style="width: 80%">

    <form class="forms" autoComplete="off" on:submit|preventDefault={updateProfile}>
      <section class="forms_header">
        <h2 class="forms_title">Set Your organisation...</h2>
        <ButtonClose handlerClose={closeModal} />
      </section>

      <fieldset class="card_form-fieldset">
        <div>        
          <input  class="card_form-input" 
                  type="text" 
                  name="title" 
                  placeholder="Fake Corp." 
                  bind:value={title} />
        </div>
        <div>
          <input  class="card_form-input" 
                  type="text" 
                  name="desc" 
                  placeholder="Manager" 
                  bind:value={desc} />
        </div>
        <div>
          <input  class="card_form-input" 
                  type="text" 
                  name="site" 
                  placeholder="www.mysite.com" 
                  bind:value={site} />
        </div>
        <div>
          <p style="color:transparent">Greeting</p>        
          <textarea class="card_form-textarea" 
                  type="text" 
                  name="greeting" 
                  placeholder="Place Your greeting here..." 
                  rows="3"
                  bind:value={greeting} />
        </div>
      </fieldset>

      <!-- <hr> -->
      <div>
        <input class="card_form-submit" type="submit" value="save"/>
      </div>
    </form>
  </section>
</div>


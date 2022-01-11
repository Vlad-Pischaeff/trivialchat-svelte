<script>
  import { modalAction } from "../store/store";
  import { url } from '../store/wstore';
  import ButtonClose from './ButtonClose.svelte';

  const closeModal = () => $modalAction = null;

</script>

<div class="modal_bg">
  <section  class="modal_form" style="width: 60%">

    <form class="forms" autoComplete="off" on:submit|preventDefault={closeModal}>
      <section class="forms_header">
        <h2 class="forms_title">How to...</h2>
        <ButtonClose handlerClose={closeModal} />
      </section>

      <div class="card_form-fieldset">  
        <p> To use an online helper, you need to set a call button on your site, 
            placing the <a href="{url}/upload/code.txt" target="_blank" rel="noopener noreferrer">HTML code</a> preferably before closing tag &lt;/body&gt;... </p>
        <p>Then plug in the <a href="{url}/upload/style.css" target="_blank" rel="noopener noreferrer">CSS styles</a>...</p>
        <p>Finally plug in a little <a href="{url}/upload/tchat.js" target="_blank" rel="noopener noreferrer">Javascript code</a>...</p>
        <p>Ensure that Your site address in Your profile is correct...</p>
        <p>That's all...</p>
        <p class="note">To prevent this message from appearing again, set your site address...</p>
      </div>

      <!-- <hr> -->
      <div>
        <input class="card_form-submit" type="submit" value="OK"/>
      </div>
    </form>
  </section>
</div>

<style>
  a {
    color: deeppink;
    font-weight: 700;
  }
  p, a {
    font-family: Esqadero;
    padding: .2rem;
  }
  p {
    color: #333;
    margin: .3rem 0;
  }
  .note {
    font-size: .9rem;
    background: deeppink;
    color: white;
    opacity: 0.4;
    animation: signal 1s infinite ease-in-out;
  }
  @keyframes signal {
    0% {
      opacity: 0.4;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.4;
    }
  }
</style>
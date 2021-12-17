<script>
  import { modalAction } from "../store/store";
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
        <p>to plug the Helper button into the site, 
          copy the code ... </p>
        <article>
          <pre>
            &lt;!-- online manager --&gt;
      &lt;section class="tchat"&gt;
          &lt;div class="tchat_wrap none" id="tchat_wrap"&gt; 
                &lt;iframe src="https://tchat.scope.cf:5001/tchat" frameborder="0" scrolling="no"&gt; &lt;/iframe&gt;
                &lt;div class="tchat_wrap-close" id="tchat_close"&gt;&lt;/div&gt;
          &lt;/div&gt;
          &lt;div class="tchat_icon" id="tchat_button"&gt;
                &lt;div class="tchat_icon-ring"&gt; &lt;/div&gt;
                &lt;div class="tchat_icon-button"&gt;&lt;/div&gt;
          &lt;/div&gt;
      &lt;/section&gt;
&lt;!-- online manager --&gt;
          </pre>
        </article>
        <p>and insert it on your site, for example, in a footer...</p>
        <p>Then connect <a href="https://tchat.scope.cf:5001/upload/style.css">styles</a> to Your site...</p>
        <p>Make sure that the site name in the profile is correct...</p>
        <p>That's all...</p>
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
    font-weight: 700;
  }
  article {
    overflow: auto;
    margin: 1rem;
    padding: .5rem;
    background: lightblue;
  }
  pre {
    color: black;
  }
  p, a {
    /* font-family: Esqadero; */
    color: #333;
    padding: .2rem 0;
  }
</style>
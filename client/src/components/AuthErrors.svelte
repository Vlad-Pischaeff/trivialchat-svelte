<script>
  import { authErrors } from '../store/store';
</script>

<div class="warnings-wrap">
  {#each $authErrors as error }
    <div class="warnings-item">{error.msg}</div>
  {/each}
</div>>

<style>
  .warnings-wrap {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
}
  .warnings-item {
    position: relative;
    left: 0rem;
    max-width: 10rem;
    border-radius: .3rem;
    background: deeppink;
    opacity: 0.8;
    margin: .2rem;
    padding: .5rem;
    animation: show .5s ease-in-out;
  }
  @keyframes show {
    from {
      opacity: 0;
      left: 10rem;
    }
  }
</style>
<script>
  export let handlerClose = () => {}
</script>

<div class="btn_close-std" on:click={handlerClose}></div>

<style>
  .btn_close-std {
    /* position: absolute;
    right: 0rem;
    top: 0rem; */
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    padding: 0.3rem;
  }
  .btn_close-std::before, 
  .btn_close-std::after {
    position: absolute;
    top: .5rem;
    right: .95rem;
    display: block;
    content: '';
    height: 1rem;
    width: 2px;
    background-color: #aaa;
  }
  .btn_close-std::before {
    transform: rotate(45deg);
  }
  .btn_close-std::after {
    transform: rotate(-45deg);
  }
  .btn_close-std:hover {
    cursor: pointer;
    background: deeppink;
  }
  .btn_close-std:hover:before,
  .btn_close-std:hover::after {
    background-color: white;
  }
</style>
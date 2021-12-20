<script>
  export let handlerClose = () => {};
  export let size = '2rem';
</script>

<div class="btn" style="--h: {size}">
  <div class="btn_close" on:click|stopPropagation={handlerClose}></div>
</div>

<style>
  * {
    --half-h: calc(var(--h)/2);
    --w: 2px;
    --ratio: 1.5;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }  
  .btn, .btn_close {
    width: var(--h);
    height: var(--h);
  }
  .btn {
    position: relative;
  }
  .btn_close {
    position: absolute;
    border-radius: 50%;
  }
  .btn_close::before, 
  .btn_close::after {
    position: absolute;
    top: calc(var(--half-h) - var(--half-h)/var(--ratio));
    left: calc(var(--half-h) - var(--w)/2);
    display: block;
    content: '';
    height: calc(var(--h)/var(--ratio));
    width: var(--w);
    background-color: #aaa;
  }
  .btn_close::before {
    transform: rotate(45deg);
  }
  .btn_close::after {
    transform: rotate(-45deg);
  }
  .btn_close:hover {
    cursor: pointer;
    background: deeppink;
  }
  .btn_close:hover::before,
  .btn_close:hover::after {
    background-color: white;
  }
</style>
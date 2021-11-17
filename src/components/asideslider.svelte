<script>
  import { onMount } from 'svelte';
  import __AsideSlider from '../js/__AsideSlider'

  $: console.log('time...',  imgRef);
  
  let imgRef;

  onMount(() => {
    const interval = setInterval(() => {
      __AsideSlider(imgRef)
    }, 4000);

    return () => {
      // console.log('unmount aside slider...')
      clearInterval(interval);
    };
  });
</script>

<aside bind:this={imgRef} class="left_aside">
  <div class="aside_img" style="background-image: url('./img/img36.jpg'); opacity: .85"></div>
</aside>

<style>
</style>
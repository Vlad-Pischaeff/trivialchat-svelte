<script>
  import { onMount } from "svelte";
  import { avatar, avatarTemp, modalAction } from "../store/store";
  import ButtonClose from './ButtonClose.svelte';

  let previewCanvasRef, hiddenCanvasRef, cropCanvasRef;
  let croppedImage;

  onMount(() => {
    cropper.start(cropCanvasRef, 1);
    cropper.startCropping();
  });
  
  const getCroppedImage = () => {
    croppedImage = cropper.getCroppedImageSrc();
  };

  const previewCroppedImage = () => {
    let ctx = previewCanvasRef.getContext('2d');
    let image = new Image();
    image.onload = function() {
      ctx.drawImage(image, 0, 0, previewCanvasRef.width, previewCanvasRef.height);
    };
    image.src = croppedImage;
  }

  const setFinalImage = () => {
    let ctx = hiddenCanvasRef.getContext('2d');
    ctx.drawImage(previewCanvasRef, 0, 0, previewCanvasRef.width, previewCanvasRef.height, 0, 0, 64, 64);
    return hiddenCanvasRef.toDataURL('image/jpeg');
  }

  const updateProfile = () => { 
    $avatar = setFinalImage();
    closeModal();
  }

  const closeModal = () => {
    $modalAction = null;
  }

  $: cropper.showImage($avatarTemp);
  $: if (croppedImage) previewCroppedImage();

</script>

<div class="modal_bg">
  <section class='modal_form'>

    <form class="forms" autoComplete="off" on:submit|preventDefault={updateProfile}>
      <section class="forms_header">
        <h2 class="forms_title">Set avatar image...</h2>
        <ButtonClose handlerClose={closeModal} />
      </section>

      <div class="forms_wrap">
        <section class="forms_wrap-left">
          <canvas bind:this={previewCanvasRef} class="prev_canvas" width="200" height="200"/>
          <canvas bind:this={hiddenCanvasRef}  class="none" width='64' height='64' />
        </section>

        <section class="forms_wrap-right">
          <canvas bind:this={cropCanvasRef} width="300" height="300" 
              on:mouseup={getCroppedImage} />
        </section>
      </div>
      <hr>
      <div>
        <input class="card_form-submit" type="submit" value="save"/>
      </div>
    </form>

  </section>
</div>

<style>
  .forms_header {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .forms_title {
    font-family: Esqadero;
    font-size: 1.5rem;
    color: deeppink;
  }
  .forms_wrap {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
  }
  .prev_canvas {
    background: lightblue;
    margin-right: 1rem;
  }
</style>
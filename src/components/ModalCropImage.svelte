<script>
  import { avatar, avatarTemp, modalAction } from "../store/store";
  import ButtonClose from './ButtonClose.svelte';

  let previewCanvasRef, hiddenCanvasRef, cropCanvasRef;
  let croppedImage, ratio;
  
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

  const getRatio = (img) => {
    let i = new Image(); 
    i.onload = function() {
      ratio = i.width / i.height;
    };
    i.src = img;
  }

  const setCanvasRatio = (ref) => {
    ref.width = 300 * ratio;
    cropper.start(cropCanvasRef, 1);
    cropper.showImage($avatarTemp); 
    cropper.startCropping();
  }

  $: if (ratio) setCanvasRatio(cropCanvasRef);
  $: getRatio($avatarTemp)
  $: if (croppedImage) previewCroppedImage();

</script>

<div class="modal_bg">
  <section class='modal_form'>

    <form class="forms" autoComplete="off" on:submit|preventDefault={updateProfile}>
      <section class="forms_header">
        <h2 class="forms_title">Set avatar image...</h2>
        <ButtonClose handlerClose={closeModal} />
      </section>

      <div class="forms_body">
        <section>
          <canvas bind:this={previewCanvasRef} class="prev_canvas" width="200" height="200"/>
          <canvas bind:this={hiddenCanvasRef}  class="none" width='64' height='64' />
        </section>

        <section>
          <canvas bind:this={cropCanvasRef} width="300" height="300" 
              on:mouseup={getCroppedImage} />
        </section>
      </div>
      
      <!-- <hr> -->
      <div>
        <input class="card_form-submit" type="submit" value="save"/>
      </div>
    </form>

  </section>
</div>

<style>
  .prev_canvas {
    background: lightblue;
    margin-right: 1rem;
  }
</style>
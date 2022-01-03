<script>
  import { onMount } from 'svelte';
  import __AvatarEffect from '../js/__AvatarEffect';
  import __ResizeImage from '../js/__ResizeImage';
  import { tooltip } from '../js/__Tooltip'
  import { modalAction } from "../store/store";
  import { avatarTemp, operator } from "../store/store";

  let refAvatar, refBg, inputRef, avatar;

  const onFileSelected = (e) => {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = async e => $avatarTemp = await __ResizeImage(e.target.result);
  }

  const handlerClick = () => inputRef.click();

  onMount(() => {
    const interval = setInterval(() => {
      __AvatarEffect(refAvatar, refBg);
    }, 2000);

    return () => clearInterval(interval);
  });

  $: if ($avatarTemp) $modalAction = 'cropImage';
  $: if ($operator.avatar) avatar = $operator.avatar;
</script>

<section class="profile" on:click={handlerClick}>
  <input class="none" type="file" accept=".jpg, .jpeg, .png" on:change={(e) => onFileSelected(e)} bind:this={inputRef} />
  <div class="profile_avatarbg" bind:this={refBg}></div>
  <img class="profile_avatar" bind:this={refAvatar} alt='avatar' 
      title="Choose a picture to represent You to users..." use:tooltip
      src={avatar}/>
</section>

<style>
  .profile {
    width: 5rem;
    height: 5rem;
    background: deeppink;
    border-radius: 50%;
    margin: 1rem 0 0 0;
    position: relative;
  }
  .profile:hover {
    cursor: pointer;
  }
  .profile img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .profile_avatarbg,
  .profile_avatar {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transition: border-radius 1.5s linear;
  }
  .profile_avatarbg {
    background: aqua;
  }
</style>
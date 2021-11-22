import { writable } from 'svelte/store';
import ModalCropImage from '../components/ModalCropImage.svelte';
import ModalSetWebAddr from '../components/ModalSetWebAddr.svelte';
import ModalSetOptions from '../components/ModalSetOptions.svelte';

export const switchToLogin = writable(true);
export const isAuthorized = writable(false);
export const avatar = writable(null);
export const avatarTemp = writable(null);
export const modalAction = writable(null);

export const modalDialogs = writable({
  cropImage: ModalCropImage,
  setWebAddr: ModalSetWebAddr,
  setOptions: ModalSetOptions,
});
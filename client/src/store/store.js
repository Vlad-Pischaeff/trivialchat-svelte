import { writable } from 'svelte/store';
import { httpRequest } from '../js/__HttpRequest';
import ModalCropImage from '../components/ModalCropImage.svelte';
import ModalSetWebAddr from '../components/ModalSetWebAddr.svelte';
import ModalSetOptions from '../components/ModalSetOptions.svelte';

export const switchToLogin = writable(true);
export const isAuthorized = writable(false);
export const avatar = writable(null);
export const avatarTemp = writable(null);
export const modalAction = writable(null);
// export const operator = writable({});

export const modalDialogs = writable({
  cropImage: ModalCropImage,
  setWebAddr: ModalSetWebAddr,
  setOptions: ModalSetOptions,
});

const createOperator = () => {
	const { subscribe, set, update } = writable(0);

	return {
		subscribe,
		init: async (e) => {
      try {
        const data = await httpRequest('/api/auth/login', 'POST', e);
        set({ ...data });
        isAuthorized.set(true);
      } catch(e) {
        // handlingErrors(e);
        alert('data error...', e.value);
      }
    },
		// modify: (e) => update(n => ({ ...n, ...e }) ),
    modify: (e) => update(async (n) => {
      try {
        const data = await httpRequest(`/api/auth/user/${n._id}`, 'PATCH', e, n.token);
        if (data) set({ ...n, ...data});
      } catch(e) {
        alert('Error while update User profile ...' + e.val);
      }
    }),
		reset: () => set({})
	};
}

export const operator = createOperator();
import { writable, get } from 'svelte/store';
import { httpRequest } from '../js/__HttpRequest';
import { randomInteger } from '../helpers/functions';
import ModalCropImage from '../components/ModalCropImage.svelte';
import ModalSetWebAddr from '../components/ModalSetWebAddr.svelte';
import ModalSetOptions from '../components/ModalSetOptions.svelte';

export const switchToLogin = writable(true);
export const isAuthorized = writable(false);
export const selectedUserIdx = writable(null);
export const avatarTemp = writable(null);
export const modalAction = writable(null);
export const url = writable(null);

export const modalDialogs = writable({
  cropImage: ModalCropImage,
  setWebAddr: ModalSetWebAddr,
  setOptions: ModalSetOptions,
});

const createOperator = () => {
	const { subscribe, set, update } = writable({});

	return {
		subscribe,
		init: async (e) => {
      try {
        const data = await httpRequest('/api/auth/login', 'POST', e);
        set({ ...data });
        isAuthorized.set(true);
        // console.log('isAuthorized...', get(isAuthorized));
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
    setAnswer: (item, i) => update(n => {
      n.answer[i] = item;
      return n;
    }),
    delAnswer: (i) => update(n => {
      n.answer.splice(i, 1);
      return n;
    }),
    setNote: (item, i) => update(n => {
      n.notes[i] = item;
      return n;
    }),
    delNote: (i) => update(n => {
      n.notes.splice(i, 1);
      return n;
    }),
		reset: () => set({})
	};
}

export const operator = createOperator();

const createClients = () => {
	const { subscribe, set, update } = writable([]);

	return {
		subscribe,
    modify: (data) => update(n => {
      let users = [ ...n ];
      if (!users.some(n => n.user === data.from)) {
        users.push({ 'user': data.from, 
                    'pict': randomInteger(0,46), 
                    'msgarr': [{ 'msg1': data.msg, 'date': data.date }], 
                    'cnt': 1});
      } else {
        users.forEach((n, i) => {
          if (n.user === data.from) {
            if (i !== get(selectedUserIdx)) {
              n.cnt = n.cnt + 1;
            }
            n.msgarr.push({'msg1': data.msg, 'date': data.date});
          }
        })
      }
      // console.log('clients...', users);
      return users;
    }),
    resetCounter: () => update(n => {
      n[get(selectedUserIdx)]['cnt'] = 0;
      return n;
    }),
		reset: () => set([])
	};
}

export const clients = createClients();
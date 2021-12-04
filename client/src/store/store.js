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
export const scrollList = writable(false);
export const authErrors = writable([]);

export const modalDialogs = writable({
  cropImage: ModalCropImage,
  setWebAddr: ModalSetWebAddr,
  setOptions: ModalSetOptions,
});

const createOperator = () => {
	const { subscribe, set, update } = writable({});

  const updateOperatorProfile = async (n, e) => {
    try {
      const data = await httpRequest(`/api/auth/user/${n._id}`, 'PATCH', e, n.token);
      if (data) set({ ...n, ...data});
    } catch(err) {
      alert('Error while update User profile ...' + err.val);
    }
  }

  const handlingErrors = err => authErrors.set(err.val);

	return {
		subscribe,
		login: async (e) => {
      try {
        const data = await httpRequest('/api/auth/login', 'POST', e);
        if (data) {
          set(data);
          isAuthorized.set(true);
        }
      } catch(err) {
        console.log('Authorization error...', err);
        handlingErrors(err);
      }
    },
    signup: async (e) => {
      try {
        const data = await httpRequest('/api/auth/register', 'POST', e);
        if (data) {
          set(data);
          isAuthorized.set(true);
        }
      } catch(err) {
        console.log('registration errors...', err);
        handlingErrors(err);
      }
    },
    modify: (e) => update(n => updateOperatorProfile(n, e)),
    setAnswer: (item, i) => update(n => {
      n.answer[i] = item;
      updateOperatorProfile(n, {'answer': n.answer});
      return n;
    }),
    delAnswer: (i) => update(n => {
      n.answer.splice(i, 1);
      updateOperatorProfile(n, {'answer': n.answer});
      return n;
    }),
    setNote: (item, i) => update(n => {
      n.notes[i] = item;
      updateOperatorProfile(n, {'notes': n.notes});
      return n;
    }),
    delNote: (i) => update(n => {
      n.notes.splice(i, 1);
      updateOperatorProfile(n, {'notes': n.notes});
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
      return users;
    }),
    resetCounter: () => update(n => {
      let idx = get(selectedUserIdx);
      n[idx]['cnt'] = 0;
      return n;
    }),
    reply: (message) => update(n => {
      let idx = get(selectedUserIdx);
      n[idx]['msgarr'].push({ 'msg0': message, 'date': Date.now() });
      return n;
    }),
    delete: () => update(n => {
      let idx = get(selectedUserIdx);
      let arr = [...n];
      arr.splice(idx, 1);
      selectedUserIdx.set(null);
      return arr;
    }),
		reset: () => set([])
	};
}

export const clients = createClients();
import { writable, get, derived } from 'svelte/store';
import { httpRequest } from '../js/__HttpRequest';
import { randomInteger, notifyMe } from '../helpers/functions';
import ModalCropImage from '../components/ModalCropImage.svelte';
import ModalSetWebAddr from '../components/ModalSetWebAddr.svelte';
import ModalSetOptions from '../components/ModalSetOptions.svelte';
import ModalHelp from '../components/ModalHelp.svelte';

export const switchToLogin = writable(true);
export const isAuthorized = writable(false);
export const selectedUserIdx = writable(null);
export const avatarTemp = writable(null);
export const modalAction = writable(null);
export const scrollList = writable(false);
export const authErrors = writable([]);
let obj = {};

export const modalDialogs = writable({
  cropImage: ModalCropImage,
  setWebAddr: ModalSetWebAddr,
  setOptions: ModalSetOptions,
  showHelp: ModalHelp,
});

const createOperator = () => {
	const { subscribe, set, update } = writable({});

  const updateOperatorProfile = async (n, e) => {
    try {
      const data = await httpRequest(`/api/auth/user/${n._id}`, 'PATCH', e, n.token);
      if (data) set({ ...n, ...data});
    } catch(err) {
      handlingErrors(err);
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
          restoreSession(data);
        }
      } catch(err) {
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

  function User(user, messages, date) {
    this.user = user;
    this.pict = randomInteger(0,46);
    this.msgarr = [{ 'msg1': messages, 'date': date }];
    this.cnt = 1;
  }

	return {
		subscribe,
    modify: (data) => update(n => {
      let users = [ ...n ];
      if (!users.some(n => n.user === data.from)) {
        let client = new User(data.from, data.msg, data.date);
        users.push(client);
      } else {
        users.forEach((n, i) => {
          if (n.user === data.from) {
            if (i !== get(selectedUserIdx)) n.cnt += 1;
            n.msgarr.push({'msg1': data.msg, 'date': data.date});
          }
        })
      }
      notifyMe(data.msg);
      return users;
    }),
    resetCounter: (idx) => update(n => {
      n[idx]['cnt'] = 0;
      return n;
    }),
    reply: (message, idx) => update(n => {
      n[idx]['msgarr'].push({ 'msg0': message, 'date': Date.now() });
      return n;
    }),
    delete: (idx) => update(n => {
      n.splice(idx, 1);
      selectedUserIdx.set(null);
      return n;
    }),
		reset: () => set([]),
    restore: (n) => { if (n) set(n) }
	};
}

export const clients = createClients();

// set store with diferent operator's chats
export const sessionStore = derived([clients, operator], 
      ([$clients, $operator]) => {
        obj = { ...obj, [$operator.email]: $clients};
        return  obj;
      });

// restore operator chat after login
const restoreSession = (operator) => { 
  let { email } = operator;
  obj[email]
    ? clients.restore(obj[email])
    : clients.restore([]);
}
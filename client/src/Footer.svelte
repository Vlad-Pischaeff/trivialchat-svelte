<script>
	import { iconOK } from './icons';

  export let Session, myWorker, messages;
  let inputVal = ''

  const sendMessage = (val) => {
		let message = new MessageObj(val)
		messages = [ ...messages, message];
		let swMessage = new innerMessageObj('post', message);
		myWorker.postMessage(JSON.stringify(swMessage));
		console.log('send message...', swMessage);
	}

	const onClick = () => {
		if (inputVal !== '') { 
			sendMessage(inputVal);
			inputVal  = '';
		}
	}

	const onKeyPress = e => { if (e.charCode === 13) onClick() };

	function MessageObj(msg) {
		this.from = Session.userID;
		this.msg = msg;
		this.date = Date.now();
	}

	function innerMessageObj(type, msg) {
		this.type = type;
		this.msg = msg;
	}
</script>

<footer class="cp_footer">
  <div class="chat_input">
    <input 	class="chat_input-text" name="question" bind:value={inputVal} 
            type="text" 
            placeholder="type your question ..."
            on:keypress={onKeyPress}>
    <img 	class="chat_input-icon" src={iconOK} alt="OK" 
          on:click={onClick}>
  </div>
</footer>
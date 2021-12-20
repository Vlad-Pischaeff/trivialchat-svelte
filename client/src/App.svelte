<script>
	import { iconAvatar, iconOK } from './icons';
	import { random_id } from './helper';

	export let name;
	let placeholderStr = 'type your question ...',
      title = 'FAKE CORP.', 
      desc = 'Manager',
      avatar = iconAvatar,
      greeting = 'Hello...',
      messages = [],
      update = false,
      ws = null,
      userID = null,
      userHOST = null,
      inputVal = '';
	
	$: console.log(inputVal);

</script>

<main class="cp" id="App">
	<section class="cp_header">
		<picture class="cp_header-avatar"><img class="cp_header-avatarimg" src={avatar}>
			<div class="cp_header-avatarbg"></div>
		</picture>
		<div class="cp_header-card">
			<div class="cp_header-card-1">{title}</div>
			<div class="cp_header-card-2">{desc}</div>
		</div>
	</section>
	<section class="cp_body">
		<div class="chat_field">
			<div class="chat_field-message">
				<div class="msg.from ? 'chat_field-messagefrom' : 'chat_field-messageto'">
					<p class="msg-data">new Date(msg.date).toLocaleString()</p>
					<p class="msg-text">msg.msg</p>
				</div>
			</div>
		</div>
	</section>
	<footer class="cp_footer">
		<div class="chat_input">
			<input 	class="chat_input-text" name="question" bind:value={inputVal} 
							type="text" 
							placeholder={placeholderStr}>
				<img class="chat_input-icon" src={iconOK} alt="OK">
		</div>
	</footer>
</main>

<style>

</style>
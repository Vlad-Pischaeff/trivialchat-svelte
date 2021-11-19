<script>
	import Asideslider from "../components/asideslider.svelte";
	import Asideprofile from "../components/asideprofile.svelte";
	import Footer from "../components/footer.svelte";
	import Logo from "../components/logo.svelte";
	import { isAuthorized, modalAction, modalDialogs } from "../store/store";

	// $: console.log('modalAction...', $modalAction);
</script>

<main>
	<div class="left-container {$isAuthorized ? 'left-container_auth' : 'left-container_notauth'}">
		{#if $isAuthorized}
			<Asideprofile/>
		{:else}
			<Asideslider/>
		{/if}
	</div>

	<div class="right-container">
		<section class="header">
			<nav>
				<a href="/">Home</a>
				<a href="/about">About</a>
				<a href="/settings">Settings</a>
			</nav>
		</section>
		<section class="main-container">
			<slot></slot>
		</section>
	</div>
</main>

<Footer/>
<Logo/>

<svelte:component this={$modalDialogs[$modalAction]} />

<style>
	.left-container, .right-container {
		position: relative;
		display: flex;
		flex-flow: column nowrap;
		justify-content: space-between;
		align-items: center;
		transition: all 1s linear;
	}
	.left-container {
		background: black;
	}
	.left-container_notauth {
		flex: 0 0 10rem;
	}
	.left-container_auth {
		flex: 0 0 8rem;
	}
	.right-container {
		flex: 1 1 auto;
		background: gray;
		display: flex;
		flex-flow: column nowrap;
	}
	.header {
		background: #333;
		height: var(--height-header);
		width: 100%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.main-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: calc(100vh - var(--height-header) - var(--height-footer));
		width: 100%;
	}
	nav a {
		padding: 0 1rem;
	}
</style>
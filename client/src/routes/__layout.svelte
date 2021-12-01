<script>
	import Asideslider from "../components/AsideSlider.svelte";
	import Asideprofile from "../components/AsideProfile.svelte";
	import Footer from "../components/Footer.svelte";
	import Logo from "../components/Logo.svelte";
	import { isAuthorized, modalAction, modalDialogs } from "../store/store";
	let leftWidth = '10rem';

	$: if ($isAuthorized) leftWidth = '8rem';
</script>

<main>
	<div class="left-container" style="--left-aside-width: {leftWidth};">
		{#if $isAuthorized}
			<Asideprofile/>
		{:else}
			<Asideslider/>
		{/if}
	</div>

	<div class="right-container" style="--left-aside-width: {leftWidth};">
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
		height: 100%;
	}
	.left-container {
		width: var(--left-aside-width);
		background: black;
		float: left;
	}
	.right-container {
		width: calc(100vw - var(--left-aside-width));
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
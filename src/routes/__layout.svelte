<script>
	import Asideslider from "../components/asideslider.svelte";
	import Asideprofile from "../components/asideprofile.svelte";
	import { isAuthorized } from "../store/store";
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

<footer>
	<p>Trivial Chat 2021 &copy;</p>
</footer>

<div class="logo {$isAuthorized ? 'logo_notauth' : 'logo_auth'}">
	trivial chat
</div>

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
		width: 13rem;
	}
	.left-container_auth {
		width: 10rem;
	}
	.right-container {
		width: 100%;
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
	.logo {
		position: absolute;
		font-family: Esqadero;
		color: deeppink;
		text-shadow: 0px 0px 15px rgba(255, 255, 255, 0.8);
		text-transform: uppercase;
		transition: all 1s ease-in-out;
	}
	.logo_auth {
		font-size: 3.3rem;
		top: 3rem;
		left: 5rem;
	}
	.logo_notauth {
		font-size: 2rem;
		top: .6rem;
		left: 10rem;
	}
</style>
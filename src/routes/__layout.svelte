<main>
	<div class="left-container"></div>

	<div class="right-container">
		<nav>
			<a href="/">Home</a>
			<a href="/about">About</a>
			<a href="/settings">Settings</a>
		</nav>
		<section class="main-container">
			<slot></slot>
		</section>
	</div>
</main>

<footer>
	<p>Trivial Chat 2021 &copy;</p>
</footer>

<div class="logo">
	trivial chat
</div>

<style>
	.left-container, .right-container {
		position: relative;
		display: flex;
		flex-flow: column nowrap;
		justify-content: space-between;
		align-items: center;
		transition: flex 1s linear;
	}
	.left-container {
		width: 13rem;
		background: black;
	}
	.right-container {
		width: 100%;
		background: gray;
		display: flex;
		flex-flow: column nowrap;
	}
	.main-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 100%;
	}
	nav {
		background: #444;
		height: 3rem;
		width: 100%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	nav a {
		padding: 0 1rem;
	}
	.logo {
		position: absolute;
		font-family: Esqadero;
		color: deeppink;
		text-shadow: 0px 0px 15px rgba(255, 255, 255, 0.8);
		font-size:  3.3rem;
		top: 3rem;
		left: 5rem;
		text-transform: uppercase;
	}
</style>
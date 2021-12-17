<script>
	import { enabledGreenLight } from '../store/wstore';
</script>

<footer>
	<div class={$enabledGreenLight ? "indicator_desc-on" : "indicator_desc-off"}>
		ws
	</div>
	<div class={$enabledGreenLight ? "indicator-on" : "indicator-off"}>
	</div>
	<p>Trivial Chat 2021 &copy;</p>
</footer>

<style>
	.indicator-on,
	.indicator-off {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
	}
	.indicator-on {
		background: rgb(205, 255, 154);
		animation: signal 1s infinite ease-in-out;
	}
	.indicator-off {
		background: #444;
		border: 1px solid #888;
	}
	.indicator_desc-on,
	.indicator_desc-off  {
		width: 3rem;
	}
	.indicator_desc-on {
		color: #ddd;
	}
	.indicator_desc-off {
		color: gray;
	}
	@keyframes signal {
  0% {
    background: rgb(115, 128, 123);
  }
  50% {
    background: aquamarine;
		box-shadow: 0 0 4px aquamarine;
  }
	100% {
		background: rgb(115, 128, 123);
	}
}
</style>
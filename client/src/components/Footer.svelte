<script>
  import { setGreenIndicator } from '../store/store';
</script>

<footer>
	<div class={$setGreenIndicator ? "indicator_desc-on" : "indicator_desc-off"}>
		WS
	</div>
	<div class={$setGreenIndicator ? "indicator-on" : "indicator-off"}>
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
    background: rgb(205, 255, 154);
  }
  50% {
    background: chartreuse;
		box-shadow: 0 0 4px chartreuse;
  }
	100% {
		background: rgb(205, 255, 154);
	}
}
</style>
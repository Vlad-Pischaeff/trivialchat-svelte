export function tooltip(element) {
	let div;
	let title;
	function mouseOver(event) {
		// NOTE: remove the `title` attribute, to prevent showing the default browser tooltip
		// remember to set it back on `mouseleave`
		title = element.getAttribute('title');
		element.removeAttribute('title');
		
		document.querySelectorAll('.tooltip').forEach(e => e.remove());
		div = document.createElement('div');
		div.classList.add("tooltip");
		div.textContent = title;
		div.style = `
			box-shadow: 0 0 4px #222;
			background: deeppink;
      opacity: 0.7;
			border-radius: .2rem;
			padding: .3rem;
			position: absolute;
      max-width: 8rem;
			top: ${event.pageX + 7}px;
			left: ${event.pageY + 5}px;
		`;
		document.body.appendChild(div);
	}
	function mouseMove(event) {
		div.style.left = `${event.pageX + 7}px`;
		div.style.top = `${event.pageY + 5}px`;
	}
	function mouseLeave() {
		document.body.removeChild(div);
		// NOTE: restore the `title` attribute
		element.setAttribute('title', title);
	}
	
	element.addEventListener('mouseover', mouseOver);
  element.addEventListener('mouseleave', mouseLeave);
	element.addEventListener('mousemove', mouseMove);
	
	return {
		destroy() {
			element.removeEventListener('mouseover', mouseOver);
			element.removeEventListener('mouseleave', mouseLeave);
			element.removeEventListener('mousemove', mouseMove);
		}
	}
}
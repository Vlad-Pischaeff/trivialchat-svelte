export function tooltip(element) {
	let div;
	let title;
	let offsetTop = 5, offsetLeft = 25;

	if ((document.documentElement.clientWidth - element.offsetLeft) < 300) {
		offsetLeft = -140;
	}

	function mouseOver(event) {
		// NOTE: remove the `title` attribute, to prevent showing the default browser tooltip
		// remember to set it back on `mouseleave`
		title = element.getAttribute('title');
		element.removeAttribute('title');
		
		document.querySelectorAll('.tip').forEach(e => e.remove());
		div = document.createElement('div');
		div.classList.add("tip");
		div.textContent = title;
		div.style = `
			top: ${event.pageX + offsetLeft}px;
			left: ${event.pageY + offsetTop}px;
			border-radius: .3rem;
			padding: .3rem;
			position: absolute;
			max-width: 8rem;
			box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
			background: deeppink;
			opacity: 0.7;
		`;
		document.body.appendChild(div);
	}
	function mouseMove(event) {
		div.style.left = `${event.pageX + offsetLeft}px`;
		div.style.top = `${event.pageY + offsetTop}px`;
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
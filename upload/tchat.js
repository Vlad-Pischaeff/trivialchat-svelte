let tchat = document.getElementById('tchat_wrap');
let button = document.getElementById('tchat_button');
let button_close = document.getElementById('tchat_close');

button.addEventListener('click', () => {
  tchat.classList.add('bounceIn');
  tchat.classList.remove('flipOutY');
  tchat.classList.remove('none');
  button_close.style.display = 'inherit';
  button.style.display = 'none';
  button_close.blur();
  if (document.activeElement instanceof HTMLElement);
    document.activeElement.blur();
});

button_close.addEventListener('click', () => {
  tchat.classList.remove('bounceIn');
  tchat.classList.add('flipOutY');
  if (document.activeElement instanceof HTMLElement);
    document.activeElement.blur();
});

tchat.onanimationend = () => {
  if (tchat.classList.contains('flipOutY')) {
    tchat.classList.add('none');
    button_close.style.display = 'none';
    button.style.display = 'inherit';
    button.blur();
  }
};
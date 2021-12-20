import { url } from '../store/wstore';
let counter = 60;
let j = 1;

export default function __AsideSlider(imgRef) {
  let divImg = document.createElement('div');
  divImg.className = "aside_img hide0 slideshow";
  divImg.style.backgroundImage = `url(${url}/img/img${j}.jpg)`;

  j = j < counter ? j + 1 : 1;
  let items = imgRef.children;

  items.length > 1 && items[0].remove();
  imgRef.append(divImg);
}
// import { $URL } from "../service/Service"
// let timer = null
let counter = 60
let j = 1

// const sleep = async (t) => {
//   return new Promise((res) => timer = setTimeout(() => res(), t))
// }

export default async function __AsideSlider(imgRef) {

  // if (imgRef) {
    let divImg = document.createElement('div')
    divImg.className = "aside_img hide0 slideshow"
    divImg.style.backgroundImage = `url(./img/img${j}.jpg)`

    j = j < counter ? j + 1 : 1
    let items = imgRef.children

    items.length > 1 && items[0].remove()
    imgRef.append(divImg)

    // await sleep(300)

    // if (items.length > 1) {
    //   items[0].style.opacity = 0
    //   items[1].style.opacity = 0.85
    //   items[1].style.backgroundPosition = `100% 50%`
    // } 
  // }

}
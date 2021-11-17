export default function __ResizeImage(datas) {
  return new Promise(async function(resolve,reject) {
    let wantedWidth, wantedHeight, maxDim = 500
    // We create an image to receive the Data URI
    var img = document.createElement('img')
    // When the event "onload" is triggered we can resize the image.
    img.onload = function() {        
      // We create a canvas and get its context.
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')

      if (img.width > img.height) {
        wantedWidth = maxDim
        wantedHeight = (img.height / img.width) * maxDim
      } else {
        wantedHeight = maxDim
        wantedWidth = (img.width / img.height) * maxDim
      }
      // We set the dimensions at the wanted size.
      canvas.width = wantedWidth
      canvas.height = wantedHeight
      console.log(`wanted WIDHT x HEIGHT ${wantedWidth} x ${wantedHeight}, original... ${img.width} x ${img.height}`)
      // We resize the image with the canvas method drawImage();
      ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight)

      var dataURI = canvas.toDataURL()

      // This is the return of the Promise
      resolve(dataURI)
    }
    // We put the Data URI in the image's src attribute
    img.src = datas
  })
}
// Use it like : var newDataURI = await resizedataURL('yourDataURIHere', 50, 50);
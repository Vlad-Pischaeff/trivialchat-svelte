const __Resize = () => {
  const chat = document.querySelector('.chat')
  const templates = document.querySelector('.templates')
  const divider = document.getElementById('divider')
  let SummaryWidth = chat.getBoundingClientRect().width + templates.getBoundingClientRect().width

  divider.onmousedown = function(e) {
    e.preventDefault()
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    let chatWidth
    // console.log('mousedown...', e.pageX, chat.getBoundingClientRect(), templates.getBoundingClientRect(), SummaryWidth)
    function moveAt(pageX) {
      chatWidth = pageX - chat.getBoundingClientRect().left
      chat.style.width = chatWidth + 'px'
      templates.style.width = SummaryWidth - chatWidth + 'px' 
    }

    function onMouseMove(event) {
      moveAt(event.pageX)
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }

  divider.ondragstart = function() { return false } 
}

export default __Resize
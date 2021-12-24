export const randomInteger = (min, max) => {
  let rand = min + Math.random() * (max + 1 - min)
  return Math.floor(rand)
}

export const notifyMe = (body) => {
  var notification = new Notification ("Received new message...", {
    body : body,
  })
}
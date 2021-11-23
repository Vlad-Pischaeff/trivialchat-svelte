let { hostname, protocol : httpPrefix } = window.location  
let wsPrefix = httpPrefix === 'http:' ? 'ws:' : 'wss:'
const $URL = `${httpPrefix}//${hostname}:5001`
const $WS_URL = `${wsPrefix}//${hostname}:5001/ws`

const App = {
  data() {
    return {
      placeholderStr: 'type your question ...',
      title: 'FAKE CORP.', 
      desc: 'Manager',
      avatar: 'data:image/png;base64,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',
      greeting: 'Hello...',
      messages: [],
      update: false,
      ws: null,
      userID: null,
      userHOST: null,
      inputVal: ''
    }
  },
  methods: {
    inputHandler(e) {
      this.inputVal = e.target.value
    },
    addMessage() {
      if (this.inputVal !== '') {
        let message = { 'from': this.userID, 'msg': this.inputVal, 'date': Date.now() }
        this.ws.send(JSON.stringify(message))
        this.inputVal  = ''
        this.pushMessage(message)
        // console.log('Messages ...', this.messages, this.userID)
      }
    },
    pushMessage(message) {
      this.messages.push(message)
      let data = JSON.parse(sessionStorage.getItem('tchat'))
      data.userMSGS = this.messages
      sessionStorage.setItem('tchat', JSON.stringify(data))
      this.update = true
    }
  },
  watch: {
    inputVal(value) {
//      console.log('inputVal ...', value)
    },
  },
  updated() {
    this.$nextTick(function () {
      if (this.update) {
        this.$refs.msg.scrollIntoView({ behavior: 'smooth' })
        this.update = false
      }
    })
  },
  async mounted() {
    let data = JSON.parse(sessionStorage.getItem('tchat'))
    // console.log('fetch data...', data)
    if (!data) {
      this.userID = random_id()
      let url = (window.location != window.parent.location)
        ? document.referrer         // ---- https://cheburator.info
        : document.location.href    // ---- https://tchat.cheburator.info:5001/tchat
      this.userHOST = url.split(':')[1].split('/')[2]

      let response = await fetch(`${$URL}/api/auth/usersite/${this.userHOST}`)
                            .then(response => response.json())

      if (!response.message) {
        this.avatar = response.avatar
        this.greeting = response.greeting
        this.title = response.title
        this.desc = response.desc
      }

      this.messages = [{ to: 'me', msg: this.greeting, date: Date.now()}]

      sessionStorage.setItem('tchat', JSON.stringify({
        userID : this.userID, 
        userHOST : this.userHOST,
        userMSGS : this.messages,
        userAvatar : this.avatar,
        userGreeting : this.greeting,
        userTitle : this.title,
        userDesc : this.desc,
      }))
    } else {
      this.userID = data.userID
      this.userHOST = data.userHOST
      this.avatar = data.userAvatar
      this.greeting = data.userGreeting
      this.title = data.userTitle
      this.desc = data.userDesc
      this.messages = data.userMSGS
    }
    this.ws = new WebSocket(`${$WS_URL}?userName=${this.userID}&userHost=${this.userHOST}`)
    this.ws.onmessage = (event) => {
      this.pushMessage(JSON.parse(event.data))
    }
    this.ws.onopen = () => {
      data
        ? this.ws.send(JSON.stringify({'oldClientConnection': this.userID, 'msg': 'persistent connection...', 'date': Date.now()}))
        : this.ws.send(JSON.stringify({'newClientConnection': this.userID, 'msg': 'initial connection...', 'date': Date.now()}))
    }
  }
}

Vue.createApp(App).mount('#App')

function random_id() {
  return (
    Number(String(Math.random()).slice(2)) + 
    Date.now() + 
    Math.round(performance.now())
  ).toString(36)
}
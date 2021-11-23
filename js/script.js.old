const App = {
  data() {
    return {
      placeholderStr: 'type your question ...',
      organisation: '', 
      description: '',
      avatar: '',
      greeting: '',
      // messages: [ { from: 'me', msg: 'Lorem ipsum dolor sit amet, consectetur mollit anim id est laborum mollit anim id est laborum mollit anim id est laborum mollit anim id est laborum mollit anim id est laborum mollit anim id est laborum mollit anim id est laborum mollit anim id est laborum mollit anim id est laborum mollit anim id est laborum', date: '2001-07-11'},
      //             { to: 'me', msg: 'sed do eiusmod tempor incididunt ut', date: '2001-07-11'},
      //             { to: 'me', msg: 'Ut enim ad minim veniam, quis nostrud', date: '2001-07-11'},
      //             { to: 'me', msg: 'Nisi ut aliquip ex ea commodo consequat', date: '2001-07-11'},
      //             { from: 'me', msg: 'Reprehenderit in voluptate velit esse', date: '2001-07-11'},
      //             { from: 'me', msg: 'Excepteur sint occaecat cupidatat non', date: '2001-07-11'},
      //             { from: 'me', msg: 'mollit anim id est laborum', date: '2001-07-11'}],
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
        console.log('Messages ...', this.messages, this.userID)
      }
    },
    pushMessage(message) {
      this.messages.push(message)
      sessionStorage.setItem('tchat', JSON.stringify({
        userID : this.userID, 
        userHOST : this.userHOST,
        userMSGS : this.messages
      }))
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
  mounted() {
    let data = JSON.parse(sessionStorage.getItem('tchat'))
    if (!data) {
      this.userID = random_id()
      let url = (window.location != window.parent.location)
        ? document.referrer         // ---- https://cheburator.info
        : document.location.href    // ---- https://tchat.cheburator.info:5001/tchat
      this.userHOST = url.split(':')[1].split('//')[1]
      this.messages = [{ to: 'me', msg: 'Добрый День! Здесь Вы можете оперативно получить ответы на интересующие Вас вопросы...', date: Date.now()}]
      sessionStorage.setItem('tchat', JSON.stringify({
        userID : this.userID, 
        userHOST : this.userHOST,
        userMSGS : this.messages
      }))
    } else {
      this.userID = data.userID
      this.userHOST = data.userHOST
      this.messages = data.userMSGS
    }
    this.ws = new WebSocket(`ws://localhost:5001/ws?userName=${this.userID}&userHost=${this.userHOST}`)
    this.ws.onmessage = (event) => {
      // console.log('vue messages...', event.data)
      this.pushMessage(JSON.parse(event.data))
    }
    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({'msg': 'initial connection...'}))
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
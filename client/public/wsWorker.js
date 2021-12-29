self.addEventListener('message', function(e) {
  let data = e.data;

  if (data.init) {
    let socket = new WebSocket(data.init);

    socket.onmessage = (event) => {
      self.postMessage(event.data);
    }

    socket.onopen = () => {
      self.postMessage(JSON.stringify({ 'wsState': 'open' }));
      socket.send(JSON.stringify({'newClientConnection': 'Session.userID', 
                              'msg': 'initial connection...', 
                              'date': Date.now()}));
      console.log('ws открыт...');
    }
  
    socket.onerror = () => {
      self.postMessage(JSON.stringify({ 'wsState': 'error' }));
      console.log('ws response ошибка...');
    }

    socket.onclose = () => {
      self.postMessage(JSON.stringify({ 'wsState': 'close' }));
      console.log('ws закрыт...');
    }
  }
}, false);


function testWS() {
  var connectionAddr = "ws://localhost:8003";
  var socket = new WebSocket(connectionAddr);
  socket.onmessage = function(event) {
      self.postMessage('Websocket : ' + event.data);
  };

  socket.onclose = function(event) {
  };

  function send(message) {
      socket.send(message);
  }

  send("hello"); //Here is where the exception is thrown
}

self.addEventListener('message', function(e) {
  let data = e.data;

  if (data.init) {
    let socket = new WebSocket(data.init);

    socket.onmessage = function(event) {
        self.postMessage('Websocket : ' + event.data);
    };
  
    socket.onclose = function(event) {
    };
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

self.addEventListener('message', function(e) {
var data = e.data;

console.log('webWorker init...');

switch (data.cmd) {
    case 'init':
        self.postMessage("Initialising Web Workers...");
        testWS();
        break;
    default:
        self.postMessage('Unknown command: ' + data.msg);
    };
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

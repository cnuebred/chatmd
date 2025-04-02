const WebSocket = require('ws');
const dotenv = require('dotenv')
dotenv.config()


const server = new WebSocket.Server({
  host: process.env.DEV_HOTRELOAD_SERVER_HOST,
  port: process.env.DEV_HOTRELOAD_SERVER_PORT
});

let sockets = [];
server.on('connection', function(socket) {
  sockets.push(socket);

  socket.on('message', function(msg) {
    sockets.forEach(s => s.send(msg.toString()));
  });

  socket.on('close', function() {
    sockets = sockets.filter(s => s !== socket);
  });
});

console.log(
  'HOTRELOAD IS WORKING ON: ' + 
  `${process.env.DEV_HOTRELOAD_SERVER_HOST}:${process.env.DEV_HOTRELOAD_SERVER_PORT}`
)
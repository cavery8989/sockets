var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
  console.log('User connected via socket');

  socket.on('message', function (message) {
    console.log('Message Recieved', message.text);
    message.timestamp = Date.now();
    io.sockets.emit('message', message);
  });

  socket.emit('message', {
    text: 'Welcome to the chat application',
    timestamp: Date.now()
  });
});

http.listen(PORT, function (){
  console.log('server started');
})

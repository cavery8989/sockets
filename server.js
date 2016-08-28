var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

io.on('connection', function (socket) {
  console.log('User connected via socket');

  socket.on('joinRoom', function (req) {
    console.log('joining -------------------')
    clientInfo[socket.id] = req;
    console.log(clientInfo);
    socket.join(req.room);
    socket.broadcast.to(req.room).emit('message', {
      name: 'System',
      text: req.name + ' Joined',
      timestamp: Date.now()
    })
  });

  socket.on('message', function (message) {
    console.log('Message Recieved', message.text);
    message.timestamp = Date.now();
    io.to(clientInfo[socket.id].room).emit('message', message);
  });

  socket.emit('message', {
    text: 'Welcome to the chat application',
    name: 'server',
    timestamp: Date.now()
  });
});

http.listen(PORT, function (){
  console.log('server started');
})

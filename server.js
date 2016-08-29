var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

function sendCurrentUsers (socket) {

  var info = clientInfo[socket.id];
  var users = [];

  if(typeof info === undefined){
    return
  }

  Object.keys(clientInfo).forEach(function(socketId){
    var userInfo = clientInfo[socketId];
    if(info.room === userInfo.room){
      users.push(userInfo.name);
    }
  });
  socket.emit('message', {
    name: 'System',
    text: 'Current users ' + users.join(', '),
    timestamp: Date.now()
  })
}

io.on('connection', function (socket) {
  console.log('User connected via socket');

  socket.on('disconnect', function () {
    var userdata = clientInfo[socket.id];
    if(typeof userdata !== undefined){
      socket.leave(userdata.room);
      io.to(userdata.room).emit('message', {
        name: 'System',
        text: userdata.name + ' has left!',
        timestamp: Date.now()
      });
      delete clientInfo[socket.id];
      console.log(userdata.name + ' left.')
    }
  });

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
    if(message.text === '@currentUsers'){
      sendCurrentUsers(socket);
    } else {
    message.timestamp = Date.now();
    io.to(clientInfo[socket.id].room).emit('message', message);
    }
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

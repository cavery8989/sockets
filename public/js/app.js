var name = getQueryVal('name') || 'anonymous';
var room = getQueryVal('room');

var socket = io();

console.log(name , room)

$('#room-name').text(room);

socket.on('connect', function () {
  console.log('connected to server');
  socket.emit('joinRoom', {
    name: name,
    room: room
  })
});

socket.on('message', function (message) {
  var messageBoard = $('#message-board');
  var timestamp = moment.utc(message.time);
  messageBoard.append("<p><strong>" + timestamp.local().format('h:mm a') +"</strong> "+ message.name +" </p>");
  messageBoard.append("<p>"+ message.text+"</p>")
});

$('#message-form').on('submit', function(e){
  e.preventDefault();
  var $form = $('#message-form');
  var message = $form.find('input[name=message]');
  console.log(message);
  if(message !== ''){
    socket.emit('message', {
      text: message.val(),
      name: name
    })
    message.val('')
  }


});

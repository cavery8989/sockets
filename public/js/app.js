var socket = io();


socket.on('connect', function () {
  console.log('connected to server');
});

socket.on('message', function (message) {
  var messageBoard = $('#message-board');
  var timestamp = moment.utc(message.time);
  messageBoard.append("<p><strong>" + timestamp.local().format('h:mm a') +"</strong> "+ message.text +" </p>");
});

$('#message-form').on('submit', function(e){
  e.preventDefault();
  var $form = $('#message-form');
  var message = $form.find('input[name=message]');
  console.log(message);
  if(message !== ''){
    socket.emit('message', {
      text: message.val(),
    })
    message.val('')
  }


});

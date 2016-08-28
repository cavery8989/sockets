var moment = require('moment');
var now = moment();


console.log(now.format('MMM Do YYYY h:mm'));
var time = Number(now.format('x'))
var timestamp = moment.utc(time);

console.log(timestamp.format());

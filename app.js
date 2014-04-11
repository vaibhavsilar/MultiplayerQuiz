// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server,{log:false});
var port = process.env.PORT || 8000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

var rooms = new Array();
var sockets = new Object();
var room = new Room("superstar");
io.sockets.on('connection', function (socket) {
  console.log("client connected");
     
  socket.on('joinRoom', function (data) {
	createSocket(socket,data);  
	socket.emit('onRoomJoined', { username: data.username });
	
	var u = room.getUsers();
    for(var i=0;i<u.length;i++)
    {
    	var s = sockets[u[i]];
    	if(data.username!=u[i]){
    	s.emit('onUserJoined', { username: data.username });
    	}
    }
  });
  
  socket.on('play', function (data) {
	  socket.emit('onPlay');
  });
});

function createSocket(s,d)
{
	sockets[d.username] = s;
	room.addUser(d.username);
}

function Room(n)
{
	this.name = n;
	this.clients = [];
}

Room.prototype.addUser = function(u)
{
	this.clients.push(u);
};

Room.prototype.removeUser = function()
{
	//this.clients.push();
};
Room.prototype.getUsers = function()
{
	return this.clients;
};
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
app.use(express.static(__dirname + '/client'));

var rooms = new Array();
var sockets = new Object();
var room = new Room("superstar");
io.sockets.on('connection', function (socket) {
  console.log('A socket with sessionID ' + socket.id); 
  socket.on('joinRoom', function (data) {
	createSocket(socket,data);  
	socket.emit('onRoomJoined', { username: data.username });

    for(var i in sockets)
    {
    	var s = sockets[i];
    	if(data.username!=s.username){
    		s.sock.emit('onUserJoined', { username: data.username});
    	}
    }
  });
  
  socket.on('play', function (data) {
	  socket.emit('onPlay');
  });
  
  socket.on('sendData', function (data) {
	  console.log(data + " received ");
	  if(data.result==true)
	  {
		var d = {msg:"check point",from:sockets[socket.id].username};
		room.broadcast(d);
	  }
  });
});

function createSocket(s,d)
{
	var o = {};
	o.sock = s;
	o.username = d.username;
	sockets[s.id] = o;
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
Room.prototype.broadcast = function(data)
{
	for(var i in sockets)
	{
		var s = sockets[i];
		s.sock.emit("sendData",data);
	}
};
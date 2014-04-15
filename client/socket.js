function EventDispatcher() {}
EventDispatcher.prototype.events = {};
EventDispatcher.prototype.addEventListener = function (key, func) {
    if (!this.events.hasOwnProperty(key)) {
        this.events[key] = [];
    }
    this.events[key].push(func);
};
EventDispatcher.prototype.removeEventListener = function (key, func) {
    if (this.events.hasOwnProperty(key)) {
        for (var i in this.events[key]) {
            if (this.events[key][i] === func) {
                this.events[key].splice(i, 1);
            }
        }
    }
};
EventDispatcher.prototype.dispatchEvent = function (key, dataObj) {
    if (this.events.hasOwnProperty(key)) {
        dataObj = dataObj || {};
        dataObj.currentTarget = this;
        for (var i=0;i<this.events[key].length;i++) {
            this.events[key][i](dataObj);
        }
    }
};
function SocketConnection(url,port)
{
	this.config = null;
	this.s = null;
	this.s = io.connect(url+port);
}
SocketConnection.prototype = new EventDispatcher();
SocketConnection.prototype.init = function(o)
{
	this.config = o;
	var self = this;
	this.s.on('onRoomJoined', function (data) {
		self.dispatchEvent("onRoomJoined",data);
	});
	this.s.on('onUserJoined', function (data) {
		self.dispatchEvent("onUserJoined",data);
	});	
};
SocketConnection.prototype.joinRoom = function(rn)
{
	var self = this;
	this.s.emit('joinRoom', { name: rn,username:this.config.username});
};
SocketConnection.prototype.play = function()
{
	var self = this;
	this.s.emit('play');
	this.s.on('onPlay', function (data) {
		self.dispatchEvent("onPlay",data);
	});
};
SocketConnection.Event_ROOM_JOINED = "roomjoined";
var sock = new SocketConnection("http://localhost:","8000");

function init()
{
	return;
	$("#q_enter").click(function(){
		var btn = $(this);
	    btn.button('loading');
	});

	$("#q_play").click(function(){
		var btn = $(this);
	    socket.emit('play');
	});
	socket.on('onPlay', function (data) {
		$("#q_listpanel").fadeOut(500);
		$("#q_mcq").show();
		$("#q_mcq").fadeIn(500);
	});
	$("#q_mcq a").click(function(e){
		$("#q_mcq a").removeClass('active');
		$(this).addClass('active');
	});
	
}
App = Ember.Application.create();
App.Router.map(function() {
	  this.resource('login');
	  this.resource('room');
});
App.IndexRoute = Ember.Route.extend({
	redirect: function() {
		this.transitionTo('login');
	}
});
App.LoginRoute = Ember.Route.extend({
	  model: function() {
	    return {username:null};
	  }
});
App.RoomRoute = Ember.Route.extend({
	  model: function() {
	    return {users:Ember.A()};
	  },
	  setupController: function(controller, model) {
		    controller.set('model', model);
		    controller.initialized();
	  }
});
App.LoginController = Ember.Controller.extend({
	actions: {
		enter: function() {
		sock.init({username:this.username});
		sock.joinRoom('superstar');
		sock.addEventListener("onRoomJoined",$.proxy(this.showRoom,this));
    }
  },showRoom:function(e)
  {
	  this.transitionToRoute('room');
  }
});

App.RoomView = Ember.View.extend({
	didInsertElement:function()
	{
		//var controller = this.get('controller');
		//console.log(controller.get('model'))
	}
});

App.RoomController = Ember.Controller.extend({
	needs:['login'],
	initialized:function()
	{
		sock.addEventListener("onUserJoined",$.proxy(this.addUser,this));
		var d = this.get('controllers.login');
		var u = this.get("model");
		u.users.pushObject(d.username);
	},addUser:function(e)
	{
		var u = this.get("model");
		u.users.pushObject(e.username);
	}
});
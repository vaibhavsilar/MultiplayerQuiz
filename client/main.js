var sock = new SocketConnection("http://localhost:","8000");

function init()
{
	return;
	$("#q_mcq a").click(function(e){
		$("#q_mcq a").removeClass('active');
		$(this).addClass('active');
	});
}
App = Ember.Application.create();
App.Router.map(function() {
	  this.resource('login');
	  this.resource('room');
	  this.resource('game');
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
App.GameRoute = Ember.Route.extend({
	model:function(){
		return jQuery.getJSON("/data/questions.json");
	},setupController: function(controller, model) {
		controller.set('model', model);
		controller.setQuestion(0);
	}
});

App.GameController = Ember.Controller.extend({
	mcq:null,
	setQuestion:function(index){
		var m = this.get("model");
		this.set("mcq",m.data.questions[index]);
	},actions:{
		sendToServer:function(d){
			console.log(d.result);			
		}
	}
});
App.McqComponent = Ember.Component.extend({
	didInsertElement:function()
	{
	},
	actions:{
		select:function(d){
			var m = this.get("model");
			
			this.sendAction('select',{result:m.ans==d.index});
			
		}
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
	},actions: {
		enterGame: function() {
			sock.play();
			sock.addEventListener("onPlay",$.proxy(this.createGame,this));
	    }
	},createGame:function()
	{
		this.transitionToRoute('game');
	}
});

App.OptionView = Ember.View.extend({
	tagName:"a",
	classNames:['list-group-item'],
	click:function()
	{
		var index = this.get('_parentView.contentIndex');
		this.get('controller').send('select', {index:index+1});
		$("#q_mcq a").removeClass("active");
		this.$().addClass("active");
	}
});
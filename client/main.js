var sock = new SocketConnection("http://localhost:","8000");

var App = Ember.Application.create();
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
	qIndex:0,
	init:function()
	{
		sock.addEventListener("onData",$.proxy(this.dataReceived,this));
	},
	setQuestion:function(index){
		var m = this.get("model");
		this.set("mcq",m.data.questions[index]);
	},actions:{
		sendToServer:function(d){
			sock.sendData(d);
		}
	},dataReceived:function(data)
	{
		this.set("qIndex",this.qIndex+1);
		this.setQuestion(this.qIndex);
	}
});
App.McqComponent = Ember.Component.extend({
	didInsertElement:function()
	{
	},
	actions:{
		select:function(d){
			var m = this.get("model");
			if(m.ans!=d.index){
				//$('#myModal').modal('show');
			}
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
	isAdmin:false,
	initialized:function()
	{
		sock.addEventListener("onUserJoined",$.proxy(this.addUser,this));
		sock.addEventListener("onPlay",$.proxy(this.createGame,this));
		
		var d = this.get('controllers.login');
		var u = this.get("model");
		u.users.pushObject(d.username);
		if(d.username=="vbh"){
			this.set('isAdmin',true);
		}		
	},addUser:function(e)
	{
		var u = this.get("model");
		u.users.pushObject(e.username);
	},actions: {
		enterGame: function() {
			sock.play();
			
	    }
	},createGame:function()
	{
		this.transitionToRoute('game');
	}
});
App.GameView = Ember.View.extend({
	classNames:['Game-container'],
	didInsertElement:function()
	{
		
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
Router.configure({
	layoutTemplate: 'layout',
	dataNotFoundTemplate: 'notFound',
	loadingTemplate: 'loading'
});

Router.route('/', {
	name: 'dashboard',
	waitOn: function () {
		if (!Meteor.user()) {
		    return Meteor.subscribe('stream', 10);
		} else {
			return [ Meteor.subscribe('stream', 10), 
					 Meteor.subscribe('myWebsites', Meteor.userId(), 2) ];
		}
	},
	action: function () {
		if (!Meteor.user()) {
		    this.render('home');
		} else {
			this.render('dashboard');
		}
		this.render('login', {to: 'menu'});
    	this.render('version', {to: 'version'});	
	}
});

Router.route('/create', {
	name: 'create',
	waitOn: function () {
		return [ Meteor.subscribe('editWebsite', Session.get('editing_website')), 
			     Meteor.subscribe('images') ];
	},
	data: function () {
	    return Websites.findOne(Session.get('editing_website'));
	},
	onBeforeAction: function() {
		if (!Meteor.user() || !Session.get('editing_website')) {
		    this.redirect('dashboard');
		} else {
			this.next();	
		};
	},
	action: function () {
		this.render('create');
		this.render('createMenu', {to:'menu'});
	}
});

Router.route('/:sitename', {
	name: 'website',
	waitOn: function () {
		return Meteor.subscribe('liveWebsite', this.params.sitename);
	},
	data: function () {
	    return Websites.findOne({sitename:this.params.sitename});
	},
	// onBeforeAction: function () {
	// 	if (!Websites.find().count()) {
	// 		this.redirect('dashboard');
	// 	} else {
	// 		this.next();
	// 	}
	// },
	action: function () {
		this.render('website');
	}

});

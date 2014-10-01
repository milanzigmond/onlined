Router.configure({
	layoutTemplate: 'layout',
	dataNotFoundTemplate: 'notFound',
	loadingTemplate: 'loading'
});

Router.route('/', {
	name: 'dashboard',
	waitOn: function () {
		return Meteor.subscribe('allWebsites');
	},
	data: function () {
	    return Websites.find();
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
		return Meteor.subscribe('editWebsite', Session.get('editing_website'));
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
		this.render('createMenu', {to: 'menu'});
	}
});

Router.route('/:sitename', {
	name: 'website',
	waitOn: function () {
		return Meteor.subscribe('liveWebsite', this.params.sitename);
	},
	data: function () {
	    return Websites.findOne();
	}

});

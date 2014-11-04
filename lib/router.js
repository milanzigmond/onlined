Router.configure({
	layoutTemplate: 'main',
	dataNotFoundTemplate: 'notFound',
	loadingTemplate: 'loading'
});

Router.route('/', {
	name: 'dashboard',
	waitOn: function () {
		if (!Meteor.user()) {
			// home
		    return [ Meteor.subscribe('stream', 50),
		    		 Meteor.subscribe('topImages', 50) ];
		} else {
			// dashboard
			return [ Meteor.subscribe('stream', 50),
					 Meteor.subscribe('topImages', 50),
					 Meteor.subscribe('myWebsites', Meteor.userId(), 10) ];
		}
	},
	data: function () {
		if (!Meteor.user()) {
			return {
				websites: Websites.find({}, {sort: {createdAt: -1}})
			}	
		} else {
			return {
				websites: Websites.find({}, {sort: {createdAt: -1}}),
				user: Meteor.user()
				// myWebsites: Websites.find({userId: Meteor.userId()},{sort: {createdAt: -1}})
			}
		}
	},
	action: function () {
		if (!Meteor.user()) {
		    this.render('home');
		} else {
			this.render('dashboard');
		}
    	this.render('version', {to: 'version'});	
	}
});

Router.route('/create', {
	name: 'create',
	waitOn: function () {
		var id = Session.get('editing_website');
		return [ Meteor.subscribe('editWebsite', id), 
			     Meteor.subscribe('images', id)];
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
	}
});

Router.route('/:sitename', {
	name: 'website',
	waitOn: function () {
		return [ Meteor.subscribe('liveWebsite', this.params.sitename),
				 Meteor.subscribe('liveWebsiteImages', this.params.sitename) ];
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

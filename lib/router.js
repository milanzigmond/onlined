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

Router.route('/:sitename/edit', {
	name: 'edit',
	waitOn: function () {
		return [ Meteor.subscribe('editingWebsite', this.params.sitename), 
			     Meteor.subscribe('images', this.params.sitename)];	
	},
	data: function () {
		var w = Websites.findOne({sitename:this.params.sitename});
		return w;
	}, 
	onBeforeAction: function() {
		// doplnit check ci je to stranka usera
		if (!Meteor.user() || !Session.get('editing_website')) {
		    this.redirect('dashboard');
		} else {
			this.next();	
		};
	},
	action: function () {
		this.render('edit');
	}
});

Router.route('/:sitename', {
	name: 'website',
	waitOn: function () {
		return [ Meteor.subscribe('liveWebsite', this.params.sitename),
				 Meteor.subscribe('liveWebsiteImages', this.params.sitename) ];
	},
	data: function () {
		var w = Websites.findOne({sitename:this.params.sitename});
		console.dir(w);
	    return w;
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

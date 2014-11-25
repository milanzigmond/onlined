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
		    return [ Meteor.subscribe('stream', 20) ];
		} else {
			// dashboard
			return [ Meteor.subscribe('stream', 20),
					 Meteor.subscribe('myWebsites', Meteor.userId(), 20) ];
		}
	},
	data: function () {
		if (!Meteor.user()) {
			return {
				sections: Sections.find({}, {sort: {createdAt: -1}})
			}	
		} else {
			return {
				sections: Sections.find({}, {sort: {createdAt: -1}}),
				myWebsites: Websites.find({userId: Meteor.userId()}, {sort: {createdAt: -1}}),
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
				 Meteor.subscribe('sections', this.params.sitename),
			     Meteor.subscribe('images', this.params.sitename)];

	},
	data: function () {
		return {
			website: Websites.findOne({sitename:this.params.sitename}),
			sections: Sections.find({}, {sort: {rank: 1}})
		}
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
				 Meteor.subscribe('sections', this.params.sitename),
				 Meteor.subscribe('images', this.params.sitename),
				 Meteor.subscribe('myLikes', Meteor.userId(), 20) ];
	},
	data: function () {
		return {
			website: Websites.findOne({sitename:this.params.sitename}),
			sections: Sections.find({}, {sort: {rank: 1}})
		}
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

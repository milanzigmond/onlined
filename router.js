Router.configure({
	layoutTemplate: 'layout',
	notFoundTemplate: 'notFound',
	loadingTemplate: 'loading',
	waitOn: function () {
		allWebsites = Meteor.subscribe('allWebsites');
		return allWebsites;
	},
	onBeforeAction: 'loading'
});

Router.map(function() {
	this.route('app', {
		path: '/',
		template: 'app'	
	});
	this.route('create', {
		path: '/create',
		onBeforeAction: function () {
			if (!Session.get('editing_website')) {
				Router.go('/');
			};
		}
	});
	this.route('login', {path: '/login'});
	this.route('website', { 
		path: '/:sitename'
	});
});

Router.configure({
	layoutTemplate: 'layout',
	notFoundTemplate: 'notFound',
	loadingTemplate: 'loading',
	waitOn: function () {
		allWebsites = Meteor.subscribe('allWebsites');
		return allWebsites;
	}
	// onBeforeAction: 'loading'
});


Router.onBeforeAction(function () {

  if (!Meteor.user()) {
    // if the user is not logged in, render the Login template
    this.render('login', {to: 'menu'});
    this.render('dashboard');
    this.render('version', {to: 'version'});
  } else {
    this.next();
  }
});

Router.route('/', {name: 'home', template: 'home'});
Router.route('/create', {name: 'create'});
Router.route('/:sitename', {name: 'website'});


// Router.map(function() {
// 	this.route('home', {
// 		path: '/',
// 		template: 'home'	
// 	});
// 	this.route('create', {
// 		path: '/create',
// 		onBeforeAction: function () {
// 			if (!Session.get('editing_website')) {
// 				Router.go('/');
// 			};
// 		}
// 	});
// 	this.route('login', {path: '/login'});
// 	this.route('website', { 
// 		path: '/:sitename'
// 	});
// });


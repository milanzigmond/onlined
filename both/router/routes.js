/*****************************************************************************/
/* Client and Server Routes */
/*****************************************************************************/


// Meteor.absoluteUrl("/", {
// 	secure: true, 
// 	replaceLocalhost: true, 
// 	rootUrl: "http://foo.example.com"
// });

Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
  // templateNameConverter: 'upperCamelCase',
  // routeControllerNameConverter: 'upperCamelCase'
});

// router hooks for whole app
// Router.onBeforeAction('dataNotFound', {only: ['onlined.detail']});
// Router.onBeforeAction('loading', {only: ['onlined.detail']});
// Ruoter.onAfterAction
// Router.onRun (runs once only)
// Router.onData (everytime the data changes)
// Router.onStop 

Router.map(function () {
  this.route('OnlinedIndex', {path: '/'});
  this.route('OnlinedDetail', {path: '/onlined/:_id'});
  //this.route('onlined.detail', {path: '/onlined/:_id', layoutTemplate: 'NoBreadcrumbs'}); to change the template on router
});

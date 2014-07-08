/*****************************************************************************/
/* Client and Server Routes */
/*****************************************************************************/
Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound',
  templateNameConverter: 'upperCamelCase',
  routeControllerNameConverter: 'upperCamelCase'
});

Router.map(function () {
  this.route('onlined.index', {path: '/'});
  this.route('onlined.detail', {path: '/onlined/:_id'});
  //this.route('onlined.detail', {path: '/onlined/:_id', layoutTemplate: 'NoBreadcrumbs'}); to change the template on router
});

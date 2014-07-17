@AdminController = RouteController.extend
  yieldTemplates:
    header:
      to: 'header'
  onBeforeAction: ->
    AccountsEntry.signInRequired(@, @pause)

Router.map ->
  @route 'onlinedIndex',
    path: '/'
    waitOn: ->
    data: ->

  @route 'dashboard',
    path: '/admin/dashboard'
    controller: 'AdminController'
    waitOn: ->
    data: ->
      templates: Templates.all()

  @route 'newTemplate',
    path: '/admin/templates/new'
    data: -> 
    	new Templates
    controller: 'AdminController'

  @route 'notFound',
    path: '*'
    where: 'server'
    action: ->
      @response.statusCode = 404
      @response.end Handlebars.templates['404']()
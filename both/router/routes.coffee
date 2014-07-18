@AdminController = RouteController.extend
  yieldTemplates:
    header:
      to: 'header'
  onBeforeAction: ->
    AccountsEntry.signInRequired(@, @pause)

Router.map ->
  @route 'home',
    path: '/'
    waitOn: ->
    data: ->

  @route 'onlinedIndex',
    path: '/smallcompany'
    waitOn: ->
    data: ->

  @route 'dashboard',
    path: '/admin'
    controller: 'AdminController'
    waitOn: ->
       Meteor.subscribe 'publishedTemplates'
    data: ->
      templates: Templates.all()

  @route 'newTemplate',
    path: '/admin/templates/new'
    data: -> 
    	new Templates
    controller: 'AdminController'

  @route 'template',
    path: '/template/:slug'
    waitOn: ->
      Meteor.subscribe 'template', @params.slug
    data: ->
      Templates.first({slug: @params.slug})
    controller: 'AdminController'

  @route 'notFound',
    path: '*'
    where: 'server'
    action: ->
      @response.statusCode = 404
      @response.end Handlebars.templates['404']()


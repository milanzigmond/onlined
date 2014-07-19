@AdminController = RouteController.extend
  yieldTemplates:
    header:
      to: 'header'
  onBeforeAction: ->
    AccountsEntry.signInRequired(@, @pause)

Router.map ->
  @route 'onlined',
    path: '/onlined'
    waitOn: ->
      Meteor.subscribe 'website'
    data: ->
      Website.first()

  @route 'home',
    path: '/'
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

  @route 'newTemplate',
    path: '/admin/templates/:slug'
    waitOn: ->
      Meteor.subscribe 'template', @params.slug
    onBeforeAction: ->
      Sessions.set('templateSlug', @params.slug)
    data: -> 
      Templates.first({slug: @params.slug})
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


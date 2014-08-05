Router.map ->
  @route 'home',
    path: '/'
    waitOn: ->
    data: ->

  @route 'create',
    path: '/create'
    waitOn: ->
    data: ->

  @route 'onlined',
    path: '/onlined'
    waitOn: ->
    data: ->

  # @route 'notFound',
  #   path: '*'
  #   where: 'server'
  #   action: ->
  #     @response.statusCode = 404
  #     @response.end Handlebars.templates['404']()


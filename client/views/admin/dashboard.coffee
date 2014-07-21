Template.dashboard.helpers
  templates: ->
    Templates.all().toArray()

  settings: ->
    fields: [
      {
        key: 'title'
        label: 'Title'
      },
      {
        key: 'description'
        label: 'description'
      },
      {
        key: 'createdAt'
        label: 'Created At'
      },
      {
        key: 'id'
        label: 'Edit'
        fn: (value, obj) ->
          new Spacebars.SafeString "<a href=\"" + Router.path('newTemplate', { slug: obj.slug }) + "\"><i class=\"fa fa-pencil\"></i></a>"
      },
    ]
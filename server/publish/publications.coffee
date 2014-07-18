Meteor.publish 'publishedTemplates', ->
	Templates.find({}, {sort: {createdAt: -1}})

Meteor.publish 'template', (slug) ->
	Templates.find({slug: slug})
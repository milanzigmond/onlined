class @Templates extends Minimongoid
	@_collection: new Meteor.Collection('templates')

	@before_create: (template) ->
		template.slug = @slugify(template.title)
		template

	@slugify: (str) ->
    	str.toLowerCase().replace(/[^\w ]+/g, "").replace(RegExp(" +", "g"), "-")

@Templates._collection.allow
	insert: (userId, doc) ->
		userId

	update: (userId, doc, fields) ->
		userId

	remove: (userId, doc) ->
		userId
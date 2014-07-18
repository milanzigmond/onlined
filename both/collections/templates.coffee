class @Templates extends Minimongoid
	@_collection: new Meteor.Collection('templates')

	@before_create: (template) ->
		template.slug = @slugify(template.title)
		debugger
		template

	@slugify: (str) ->
    	str.toLowerCase().replace(/[^\w ]+/g, "").replace(RegExp(" +", "g"), "-")
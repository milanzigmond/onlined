Template.dogLover.created = ->
	Session.set 'website', {
		'title' : 'Our dog Bob',
		'tagline' : 'He is the best!'
	}

Template.dogLover.helpers
  title: ->
    Session.get('website').title

  tagline: ->
    Session.get('website').tagline
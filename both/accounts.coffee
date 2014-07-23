Meteor.startup ->
  # Accounts.ui.config
  #   passwordSignupFields: 'EMAIL_ONLY'

  AccountsEntry.config
    showSignupCode: false
    # homeRoute: '/'
    # dashboardRoute: '/admin'
    # language: 'en'
 
  # Accounts.onCreateUser (options, user) ->	
 	# if Meteor.users.find().count() is 0
 	# 	user.admin = true
 	# user
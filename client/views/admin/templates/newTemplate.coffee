 Template.newTemplate.events
 	'submit form': (event) -> 
 		event.preventDefault()
 		formData = SimpleForm.processForm(event.target)
 		Templates.create(formData)
 		Router.go('/admin')
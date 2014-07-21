Template.editTemplate.events
 	'submit form': (event) -> 
 		event.preventDefault()
 		formData = SimpleForm.processForm(event.target)
 		template = Templates.first({slug:this.slug})
 		template.update(formData)
 		Router.go('/admin')
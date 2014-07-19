 Template.newTemplate.helpers

 Template.newTemplate.events
 	'submit form': (event) -> 
 		event.preventDefault()
 		formData = SimpleForm.processForm(event.target)
 		if Session.get('templateId')
 			template = Template.first({slug:Session.get('templateSlug')})
 			template.update(formData)
 			Session.set 'templateSlug', null
 		else
 			Templates.create(formData)
 		Router.go('/admin')
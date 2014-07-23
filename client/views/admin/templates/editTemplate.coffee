Template.editTemplate.events
 	'submit form': (event) -> 
 		event.preventDefault()
 		formData = SimpleForm.processForm(event.target)
 		template = Templates.first({slug:this.slug})
 		template.update(formData)
 		Router.go('/admin')


 Template.editTemplate.created = ->
  console.log "editTemplate created"
  return

Template.editTemplate.rendered = ->
  # console.log "editTemplate rendered"
  # editor = new ReactiveAce()
  # editor.theme = 'monokai'
  # editor.syntaxMode = 'javascript'
  # editor.attach("editor")
  return

Template.editTemplate.destroyed = ->
  console.log "editTemplate created"
  return
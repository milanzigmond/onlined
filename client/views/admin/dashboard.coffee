Template.dashboard.templates = ->
  Templates.all().toArray()

  
 Template.dashboard.created = ->
  console.log "dashboard created"
  return

Template.dashboard.rendered = ->
  console.log "dashboard rendered"
  return

Template.dashboard.destroyed = ->
  console.log "dashboard created"
  return
safeFile = (file) ->
  console.log "saving file: " + file.name
  reader = new FileReader()
  reader.onload = (e) ->
    console.log "file updated to: " + e.target.result
    Session.set 'image', e.target.result

  reader.readAsDataURL file

Template.dogLover.created = ->
  Session.set 'title', 'Our dog Bob'
  Session.set 'tagline', 'He is the best!'
  Session.set 'image', 'dog.png'

Template.dogLover.helpers
  title: ->
    Session.get('title')

  tagline: ->
    Session.get('tagline')

  image: ->
    Session.get('image')


Template.dogLover.events
  'drop .drop' : (e,t) ->
    e.stopPropagation()
    e.preventDefault()
    console.log 'dropped'
    file = e.originalEvent.dataTransfer.files[0]
    safeFile(file)

  'change #upload' : (e, t) ->
    e.stopPropagation()
    e.preventDefault()
    file = t.find('#upload').files[0]
    safeFile(file)

  'dragover .drop' : (e,t) ->
    e.stopPropagation()
    e.preventDefault()
    console.log 'dragged'

  'click .drop' : (e,t) ->
    console.log 'clicked'





  



safeFile = (file) ->
  console.log "saving file: " + file.name
  reader = new FileReader()
  reader.onload = (e) ->
    Session.set 'canContinue', true
    Session.set 'alert', null
    console.log "file updated to: " + e.target.result
    Session.set 'imageToUpload', e.target.result

  reader.readAsDataURL file

Template.editImage.helpers
  imageToUpload : ->
    if Session.get("imageToUpload") then Session.get("imageToUpload") else "tea.jpg"

Template.editImage.events
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
  




  



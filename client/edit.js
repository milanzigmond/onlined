function checkInputField ( event ) {
    var value = $(event.target).val();

    if (value.length === 0) {
        $(event.target).removeClass( "valid" ).addClass( "invalid" );
        return false;
    } else {
        $(event.target).removeClass( "invalid" ).addClass( "valid" );
        Session.set('editing_field_value', value);
        return true;
    };
};

function addIndexToArray ( array ) {
    if(!array) return;

    for( var i = 0; i < array.length; i++ ) {
        array[i].index = i;
    };
    return array;
};

function saveField ( event ) {
    var websiteId           = Session.get('editing_website'),
        sectionId           = Blaze.getData(event.target)._id,
        contentId           = event.target.parentElement.id,
        value               = Session.get('editing_field_value'),
        setModifier         = { $set: {} };

    setModifier.$set['data.' + contentId ] = value;
    Sections.update({_id: sectionId}, setModifier);
};

function saveFile ( event ) {

    // get contentId from the DOM
    var contentId       = event.target.parentElement.id;
    if (!contentId) 
        contentId       = event.target.parentElement.parentElement.id;
    if (!contentId) return;

    var websiteId       = Session.get('editing_website'),
        sectionData     = Blaze.getData(event.target),
        sectionId       = sectionData._id,
        presentFileId   = sectionData.data[contentId],
        tagName         = $(event.target).get(0).tagName,
        index           = ( tagName === "SPAN" ) ? $(event.target.parentElement.parentElement).data('index') : $(event.target.parentElement).data('index'),
        file, fsFile, fileObj;
        

    // check present file id for galleries
    if ( presentFileId instanceof Object )
        presentFileId   = website[ 'content.' + contentId + '.' + index + '.imageId' ];

    // check for the correct file 
    if ( tagName === "DIV" || tagName === "SPAN") {
        file            = event.originalEvent.dataTransfer.files[0];
    } else if ( tagName === "INPUT") {
        file            = event.target.files[0];
    };

    // create fs file to insert
    fsFile = new FS.File(file),
    fsFile.userId = Meteor.userId();
    fsFile.websiteId = websiteId;
    fsFile.sectionId = sectionId;
    fsFile.contentId = contentId;
    
    // insert new file  
    fileObj = Images.insert(fsFile, function (err, fileObj) {
      // todo add tooltip
      if(!err) {
        if ( presentFileId && presentFileId !== "") {
            Images.remove(presentFileId);
        }
      } else {
        console.log(err);
      }
    });

    if(!fileObj) return;

    // update website content
    if( index !== undefined ) {
        // this is a gallery
        var setModifier = { $set: {} };
        setModifier.$set['data.' + contentId + '.' + index + '.imageId' ] = fileObj._id;
    } else {
        var setModifier = { $set: {} };
        setModifier.$set['data.' + contentId ] = fileObj._id;
    }

    Sections.update({_id: sectionId}, setModifier);
};

function setupMap () {
    var editingWebsite = Websites.findOne(Session.get('editing_website')),
        address = editingWebsite.content.address,
        latLng = editingWebsite.content.latLng;
    
    if(!latLng) return;
    
    var input = (document.getElementById('input')),
        autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.bindTo('bounds', map);

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) { return; };
        
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(13);
        }

        var ll = {
            lat:place.geometry.location.k, 
            lng:place.geometry.location.B
        }; 

        var params = [
            editingWebsite, 
            place.formatted_address, 
            ll
        ];

        Meteor.call("updateLocation", editingWebsite._id, place.formatted_address,ll, function (err) {
                if(err) console.log(err);
        });

        // Websites.update({_id:editingWebsite},{ $set: { 
        //     'content.address': place.formatted_address,
        //     'content.latLng': ll}
        // });
    });
};

function countLines (id) {
    var element = document.getElementById(id),
    divHeight = element.offsetHeight;
    var lineHeight = parseInt(element.style.lineHeight);
    if (!lineHeight) lineHeight = parseInt(getComputedStyle(element, null).getPropertyValue("line-height"));
    var lines = Math.ceil(divHeight / lineHeight);
    return lines;
};

function makeEditable (event, template) {
    preventActionsForEvent(event);

    if(Session.get('editing_field_value')) return;
    Session.set('editing_field', event.target.id);
    Session.set('editing_field_value', $(event.target).text());

    var contentId       = event.target.id,
        textContent     = event.target.textContent,
        $eventTarget    = $(event.target),
        parent          = event.target.parentElement,
        tagName         = $eventTarget.get(0).tagName,
        textAlign       = $eventTarget.css('text-align'),
        fontFamily      = $eventTarget.css('fontFamily'),
        fontSize        = $eventTarget.css('fontSize'),
        input;

    // debugger

    if (tagName === "H1" || tagName === "H2" || tagName === "H3" || tagName === "H4" || tagName === "H5" || tagName === "H6") {
        // it's a text field
        if (contentId === "address") {
            input = '<input id="input" class="controls" style="text-align:'+textAlign+';font-size:'+fontSize+';font-family:'+fontFamily+';" type="text" placeholder="Enter a location" value="'+textContent+'"/>';

            $( event.target ).before( '<'+tagName+' id="'+contentId+'">'+ input + '</'+tagName+'>');

            setupMap();
        } else {
            input = '<input id="input" style="text-align:'+textAlign+';font-size:'+fontSize+';font-family:'+fontFamily+';" type="text" value="'+textContent+'"/>';

            $( event.target ).before( '<'+tagName+' id="'+contentId+'">'+ input + '</'+tagName+'>');
        }
    
        $( event.target ).hide();
    }
    
    if (tagName === "P") {
        // var lines = countLines(contentId);
        lines = 5;
        // it's a text area
        input = '<textarea id="input" style="text-align:'+textAlign+';font-size:'+fontSize+';font-family:'+fontFamily+';" rows="'+lines+'" cols="50">'+textContent+'</textarea>';

        $( event.target ).before( '<p id="'+contentId+'">'+ input + '</p>');
        // $( event.target ).before(input);
        $( event.target ).hide();   
    }
    
    if (tagName === "IMG") {
        // it's an image
        
        var website = Websites.findOne(Session.get('editing_website'));
        var id = event.target.parentElement.id;

        input = '<input id="input" type="text" placeholder="your '+ parent.id + ' url here" value="'+website.content[id]+'"/>';
        
        $( event.target ).before(input);
        $( event.target ).hide();
    }

    activateInput($(parent).find('#input'));
};

function activateInput (input) {
    Deps.flush();
    input.focus()
    input.select();
};

Template.edit.created = function () {
    Session.setDefault('editing_field', null);
    Session.setDefault('editing_field_value', null);
    Session.setDefault('editing_website', null);
};

Template.edit.rendered = function () {
    
    // Session.set('sortableSections', this.data.sections);

    // window.scrollTo(0, 0);
    // autohideNavbar();

    // toto tu prekontrolvoat cu to tu treba k tej mape
    // Deps.autorun(function() {
    //     var w = Websites.findOne();
    //     if( w.content.latLng ) { showMap(w.content.latLng); };
    // });

    $('.sections').sortable({
        tolerance: 'pointer',
        stop: function ( e, ui ) {
            var el = ui.item.get(0),
            before = ui.item.prev().get(0),
            after = ui.item.next().get(0),
            newRank;

            if( !before ) {
                newRank = Blaze.getData(after).rank - 1;
            } else if ( !after ) {
                newRank = Blaze.getData(before).rank + 1;
            } else {
                newRank = (Blaze.getData(after).rank + Blaze.getData(before).rank)/2;
            }

            var sectionId = Blaze.getData(el)._id;

            Sections.update({_id: sectionId}, {$set: {rank: newRank}})
        }
    })
};

function sortByIndex ( array ) {
    console.log('sortByIndex');
    return array.sort(function(a,b){return a.index - b.index});
}

Template.edit.destroyed = function () {
    // destroyNavbar();
};

Template.edit.helpers({
    hidden: function () {
        return this.hidden;
    },
    editImageText: function () {
        return "click or drag&drop";
    },
    style: function () {
        return this.website.style;
    },
    goHome: function () {
        Router.go('/');
    },
    galleryImages: function () {
        return addIndexToArray( this.content.gallery );
    },
    highlightImages: function () {
        return this.content.highlightImages;
    },
    twitterOpacity: function () {
        var opacity = (this.content.twitter === "") ? "0.3" : "1";
        return opacity;
    },
    youtubeOpacity: function () {
        var opacity = (this.content.youtube === "") ? "0.3" : "1";
        return opacity;
    },
    facebookOpacity: function () {
        var opacity = (this.content.facebook === "") ? "0.3" : "1";
        return opacity;
    },
    instagramOpacity: function () {
        var opacity = (this.content.instagram === "") ? "0.3" : "1";
        return opacity;
    }
});

Template.edit.events({
    'click div.draggableSection' : function ( event, template ) {
        if(this.hidden) {
            Sections.update({_id:this._id}, {$set: { hidden: false }});
        } else {
            Sections.update({_id:this._id}, {$set: { hidden: true }});
        }
    },
    'click p,h1,h2,h3,h4,h5,h6': function ( event, template ) {
        countLines(event.target.id);
        makeEditable( event, template );
    },
    'click .link' : function ( event, template ) {
        makeEditable( event, template );
    },
    'keyup #input' : function( event, template ) {
        var tagName = $(event.target).get(0).tagName;

        preventActionsForEvent( event );

        if(checkInputField( event )){
            if (event.which === 27) {
                $(event.target).blur();
            };
            if(event.which === 13 && tagName !== "TEXTAREA") {
                $(event.target).blur();
            };
        } else {
            animateNegativeRaction( event );
        }
    },
    'focus #input' : function ( event, template ) {
        preventActionsForEvent( event );
        checkInputField( event );
    },
    'focusout #input' : function ( event, template ) {
        preventActionsForEvent(event);
        var parent = event.target.parentElement,
            sibling = parent.nextSibling,
            social = ['twitter', 'youtube', 'facebook', 'instagram'];

        if (checkInputField( event )){
            saveField( event );
        }

        // if(parent.id === "address") {
            // sibling = parent.previousElementSibling;
            // $(parent).toggle();
        // } else 

        if (_.contains(social, parent.id) ) {
            sibling = event.target.nextElementSibling; 
            $(event.target).remove();
        } else {    
            $(parent).remove(); // calls focusout event 
        }


        $(sibling).show();
        Session.set('editing_field', null); 
        Session.set('editing_field_value', null);
    },
    'mouseenter div.img' : function ( event, template ) {
        preventActionsForEvent( event );
        $( event.target ).addClass("hover");
    },
    'mouseleave div.img' : function ( event, template) {
        preventActionsForEvent(event);
        $( event.target ).removeClass("hover");
    },
    'dragover' : function ( event, template ) { 
        preventActionsForEvent(event); 
    },
    'drop' : function ( event, template ) { 
        preventActionsForEvent(event); 
    },
    'drop .overlay' : function ( event, template ) {
        preventActionsForEvent(event);
        saveFile( event );
    },
    'drop .expand' : function ( event, template ) {
        preventActionsForEvent(event);
        saveFile( event );
    },
    'click .overlay' : function ( event, template ) {
        preventActionsForEvent( event );
        $(event.target.nextElementSibling).click();
    },
    'click .expand' : function ( event, template ) {
        preventActionsForEvent( event );
        $(event.target.parentElement.nextElementSibling).click();
    },
    'change input[type=file]' : function ( event, template ) {
        preventActionsForEvent( event );
        saveFile( event );
    }
});
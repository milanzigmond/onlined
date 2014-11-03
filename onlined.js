

// FS.debug = true;


var imageGridFSStore = new FS.Store.GridFS("images", {
  mongoUrl: 'mongodb://127.0.0.1:3001/meteor' // optional, defaults to Meteor's local MongoDB
  // mongoOptions: {...},  // optional, see note below
  // transformWrite: myTransformWriteFunction, //optional
  // transformRead: myTransformReadFunction, //optional
  // maxTries: 1, // optional, default 5
  // chunkSize: 1024*1024  // optional, default GridFS chunk size in bytes (can be overridden per file).
                        // Default: 2MB. Reasonable range: 512KB - 4MB
                    });

Images = new FS.Collection("images", {
    stores: [imageGridFSStore],
    filter: {
        allow: {
            extensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp']
        }
    }
});

Images.allow({
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    },
    remove: function () {
        return true;
    },
    download: function () {
        return true;
    }
});


if (Meteor.isClient) {

    function updateWebsiteCount() {
        Meteor.call('getWebsitesCount', function (err, count) {
            Session.set('websitesCount', count); 
        });
    }

    Websites.find().observe({
        added: updateWebsiteCount,
        removed: updateWebsiteCount
    });

    Session.setDefault('websitesCount', null);
    Session.setDefault('editing_field', null);
    Session.setDefault('editing_field_value', null);
    Session.setDefault('editing_website', null);
    Session.setDefault('styles', [
        {name:"Default Visual Style", class:"default"},
        {name:"Elegant", class:"elegant"},
        {name:"Airy", class:"airy"},
        {name:"Starry", class:"starry"},
        {name:"Intense", class:"intense"}
        ]);
    Session.setDefault('alert', null);
    Session.setDefault('autocomplete', null);
    Session.setDefault('hidingNavbar', null);

    Session.set('version', '0.2.1');

    if (Accounts._resetPasswordToken) {
        Session.set('resetPassword', Accounts._resetPasswordToken);
    } 

    var DateFormats = {
        since: "YYYY MMMM DD",
        short: "DD MMMM YYYY",
        long: "DD MMMM YYYY HH:mm (dddd)"
    };

    Template.registerHelper("formatDate", function(datetime) {
        if (moment) {
            return moment(datetime).fromNow();
        }
        else {
            return datetime;
        }
    });

    Template.registerHelper("showImage", function(id) {
        if(!id) return;
        // console.log('id:'+id);
        var file = Images.findOne(id);
        if(!file) return;
        // console.log('showImage:'+file.contentId);
        return file.url();
    });

    Template.registerHelper('toUpperCase', function(str) {
        // check(str, String);
        if(!str) return;
        return str.toUpperCase();
    });

var showMoreVisible = function () {
    var treshold, target = $('#laod-more');
    if(!target.length) return;

    treshold = $(window).scrollTop() + $(window).height() - target.height();

    if (target.offset().top < treshold) {
        if (!Session.get('visible')) {
            Session.set('visible', true);
            Meteor.setTimeout(function(){Session.set('websitesLimit', Session.get('websitesLimit')+9)}, 200);
        };
    } else {
        if (Session.get('visible')) {
            Session.set('visible', false);
        };
    }

}

////////// Helpers for in-place editing //////////
var makeEditable = function (event, template) {
    preventActionsForEvent(event);

    // console.log('make editable - editing field value: '+ Session.get('editing_field_value'));

    if(Session.get('editing_field_value')) return;
    Session.set('editing_field', event.target.id);
    Session.set('editing_field_value', $(event.target).text());

    // console.log('make editable - editing field value: '+ Session.get('editing_field_value'));


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


var activateInput = function (input) {
    Deps.flush();
    input.focus()
    input.select();
};

var showAlert = function (alert) {
    $('div.alert').text(alert).slideDown(300).delay(2000).slideUp(300);
};

var preventActionsForEvent = function (event) {
    event.preventDefault();
    event.stopPropagation();
};


function getUserEmail () {
    if(!Meteor.user()) return;
    var email,
    emails = Meteor.user().emails,
    services = Meteor.user().services;

    if (emails) {
        email = emails[0].address;
    } else if (services) {
        email = services.facebook.email;
    };

    return email;
}

var countLines = function (id) {
    var element = document.getElementById(id),
    divHeight = element.offsetHeight;
    var lineHeight = parseInt(element.style.lineHeight);
    if (!lineHeight) lineHeight = parseInt(getComputedStyle(element, null).getPropertyValue("line-height"));
    var lines = Math.ceil(divHeight / lineHeight);
    return lines;
}

var setupMap = function () {
    console.log('setupMap');
    
    var editingWebsite = Websites.findOne(Session.get('editing_website')),
        address = editingWebsite.content.address,
        latLng = editingWebsite.content.latLng;
    
    if(!latLng) return;
    
    var input = (document.getElementById('input')),
        autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.bindTo('bounds', map);

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        console.log('place changed');
        // infowindow.close();
        // marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) { return; };
        
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(13);  // Why 17? Because it looks good.
        }

        var editingWebsite = Session.get('editing_website');

        Websites.update({_id:editingWebsite},{ $set: { 
            'content.address': place.formatted_address,
            'content.latLng': {lat:place.geometry.location.k, lng:place.geometry.location.B}}
        });

        marker.setIcon(({
            url: 'logo.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        }));
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
    });
};

var showMap = function (website) {
    console.log('showMap');
    var address = website.content.address,
        latLng = website.content.latLng,
        mapOptions = {
            scrollwheel: false,
            center: new google.maps.LatLng(latLng.lat, latLng.lng),
            zoom: 13
        };
    
    map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
    marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        });

    marker.setVisible(false);

    map.setCenter(latLng);
    map.setZoom(13);
    
    marker.setIcon(({
        url: "logo.png",
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(latLng);
    marker.setVisible(true);

    google.maps.event.addListener(map, 'idle', function() {
        window.setTimeout(function() {
          map.panTo(marker.getPosition());
          console.log('timeout run');
      }, 3000);
    });

    google.maps.event.addListener(marker, 'click', function() {
        map.setZoom(15);
        map.setCenter(marker.getPosition());
    });
};

var isGallery = function ( contentId ) {
    if( !contentId ) return;

    var websiteId = Session.get('editing_website'),
        website = Websites.findOne(websiteId),
        content = website.content[contentId];

    if(content instanceof Array) {
        return true;
    } else {
        return false;
    }
}

var saveFile = function ( event ) {

    // get contentId from the DOM
    var contentId       = event.target.parentElement.id;
    if (!contentId) 
        contentId       = event.target.parentElement.parentElement.id;
    if (!contentId) return;

    var index           = $(event.target.parentElement).data('index'),
        websiteId       = Session.get('editing_website'),
        website         = Websites.findOne(websiteId),
        presentFileId   = website.content[contentId],
        tagName         = $(event.target).get(0).tagName,
        fsFile, 
        fileObj;

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
    fsFile.contentId = contentId;
    
    // insert new file  
    fileObj = Images.insert(fsFile, function (err, fileObj) {
      // todo add tooltip
      console.log(err);
      if(!err) {
        if ( presentFileId && presentFileId !== "") {
            Images.remove(presentFileId);
        }
      }
    });

    if(!fileObj) return;

    // update website content
    if( index !== undefined ) {
        console.log('saving gallery image');
        var setModifier = { $set: {} };
        setModifier.$set['content.' + contentId + '.' + index + '.imageId' ] = fileObj._id;
    } else {
        console.log('saving '+contentId+' image');
        var setModifier = { $set: {} };
        setModifier.$set['content.'+contentId ] = fileObj._id;    
    }

    Websites.update({_id:websiteId}, setModifier);
};

var trimInput = function(val) {
    return val.replace(/^\s*|\s*$/g, "");
};

var isValidPassword = function(val, field) {
    if (val.length >= 6) {
        return true;
    } else {
        showAlert('Password must be min 6 chars');
        return false; 
    }
};

var saveField = function ( event ) {
    var websiteId = Session.get('editing_website'),
        parent = event.target.parentElement,
        value = Session.get('editing_field_value'),
        setModifier = { $set: {} };

    // console.log('saving field:'+parent.id+' with value: '+value);

    setModifier.$set['content.'+ parent.id ] = value;
    Websites.update({_id:websiteId}, setModifier);
}

var animateNegativeRaction = function ( event ) {
    console.log('animateNegativeRaction');
    if (!$(event.target).is(':animated')) {
        $(event.target).animate({'margin-left':'-5px'},70).animate({'margin-left':'5px'}, 70).animate({'margin-left':'-5px'},70).animate({'margin-left':'0px'}, 70);    
    };
}

Template.create.events({
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

var websiteListItemMouseEnter = function ( event ) {
    $(event.target).find('.websiteItemOverlay').animate({opacity: 0.1}, 200);
}

var websiteListItemMouseLeave = function ( event ) {
    $(event.target).find('.websiteItemOverlay').animate({opacity: 0.5}, 200);
}

var blurCreateWebsiteInput = function () {
    var parent = $('#register-sitename');
    var input = parent.find('input');
    var label = parent.find('span');

    input.fadeOut(200);
    // label.delay(250).fadeTo("fast", 100);
    label.delay(250).fadeIn(100);
}

var checkDuplicity = function ( sitename , parent) {
    var sitename = sitename.toLowerCase();

    Meteor.call('checkDuplicity', sitename, function (err, exists) {
        if(exists) {
            blurCreateWebsiteInput();

            var website_id = Websites.insert({sitename: sitename});
            Session.set('editing_website', website_id);

            Router.go('create');
        } else {
            $('.textInput').animate({'margin-left':'-5px'},70).animate({'margin-left':'5px'}, 70).animate({'margin-left':'-5px'},70).animate({'margin-left':'0px'}, 70);
            parent.removeClass( "valid" ).addClass( "invalid" );
        };
    });
}

Template.dashboard.events({
    'click #register-sitename' : function ( event, template ) {

        var parent = $('#register-sitename'),
            input = parent.find('input'),
            label = parent.find('span');

        parent.removeClass( 'pulseEffect' );

        $(input).val("");

        label.fadeOut(200);
        input.delay(210).fadeIn(200, function(){
            this.focus();
        });
    },
    'focusout .textInput' : function ( event, template ) {
        var parent = $(event.target).parent();
        parent.addClass( 'pulseEffect');
        blurCreateWebsiteInput();
        parent.removeClass( "invalid" ).addClass( "valid" );
    },
    'keydown .textInput' : function ( event, template ) {
        var parent = $(event.target).parent(),
            sitename = $(event.target).val();

        if ( checkSitename( event ) ) {
            parent.removeClass( "invalid" ).addClass( "valid" );
        } else {
            parent.removeClass( "valid" ).addClass( "invalid" );
        }
    },
    'keyup .textInput' : function ( event, template ) {
        var input = $(event.target),
            parent = input.parent(),
            sitename = $('.textInput').val(),
            value = input.val();

        if ( checkSitename( event ) ) {
            parent.removeClass( "invalid" ).addClass( "valid" );
        } else {
            parent.removeClass( "valid" ).addClass( "invalid" );
        }

        if (event.which === 13) {
            if ( checkSitename( event ) ) {
                checkDuplicity ( sitename,  parent);
            } else {
                animateNegativeRaction( event );
            };
        };
    },
    'click .myWebsiteListItem' : function ( event, template ) {
        preventActionsForEvent( event );
        Session.set('editing_website', this._id);
        Router.go('create');
    },
    // 'click .websiteListItem' : function ( event, template) {
    //     preventActionsForEvent( event );
    //     Router.go("/"+this.sitename);
    // },
    'click .glyphicon-remove' : function ( event , template ) {
        Session.set('editing_website', null);
        Websites.remove({_id:this._id});
    },
    'hover .websiteItemContent' : function ( event, template ) {
        preventActionsForEvent( event );
    }
});

Template.home.events({
    'click .websiteListItem' : function ( event, template) {
        preventActionsForEvent( event );
        Router.go("/"+this.sitename);
    },

    'mouseenter .websiteListItem' : function ( event, template ) {
        websiteListItemMouseEnter ( event );
    },

    // website list item
    'mouseleave .websiteListItem' : function ( event, template ) {
        websiteListItemMouseLeave( event );
    },

    'hover .websiteItemContent' : function ( event, template ) {
        preventActionsForEvent( event );
    }
});

var addIndexToArray = function ( array ) {
    for( var i = 0; i < array.length; i++ ) {
        array[i].index = i;
    };
    return array;
}

Template.create.helpers({
    editImageText: function () {
        return "click or drag&drop";
    },
    style: function () {
        return this.style;
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

Template.home.helpers({
    numberOfWebsites: function () {
        return Session.get('websitesCount');
    },
    website: function () {
        return Websites.find({},{sort: {createdAt: -1}});
    }
});


Template.selectStyle.helpers({
    styleOptions: function () {
        return Session.get('styles');
    },
    selectedStyle: function () {
        var style = Websites.findOne(Session.get('editing_website')).style;
        
        if (!style) return;

        var styles = Session.get('styles'),
            styleName;

        _.each(styles, function ( element, index, list) {
            if (element.class === style) {
                styleName = element.name;
            };
        });

        return styleName;
    }
});

Template.selectStyle.events({
    'click ul.dropdown-menu': function ( event, template ) {
        var style = $(event.target).data('style');

        if(!style) return;

        var editingWebsite = Session.get('editing_website');
        
        if (editingWebsite) {
            Websites.update(
                {_id: editingWebsite},
                { $set: { style: style}}
            );
        };
    }
});

Template.version.helpers({
    version: function () {
        return Session.get('version');
    }
});

Template.login.helpers({
    onlinedTitle: function () {
        return "ONLINED.AT";
    }
});

Template.createMenu.helpers({
    onlinedTitle: function () {

        var o = "ONLINED.AT",
            w = Websites.findOne(this._id);
        
        if (w)
            return o + '/' + w.sitename.toUpperCase();
        else 
            return o;
    }
});

Template.createMenu.events({
    'dragover' : function ( event, template ) { 
        preventActionsForEvent(event); 
    },
    'drop' : function ( event, template ) { 
        preventActionsForEvent(event); 
    }
});

Template.website.helpers({
    style: function () {
        return this.style;
    },
    email: function () {
        return getUserEmail();
    },
    galleryImages: function () {
        return this.content.gallery;
    },
    website: function () {
        return Websites.find({sitename:this.params.sitename});
    }
});

Template.layout.helpers({
    alert: function () {
        return Session.get("alertMessage");
    },
    email: function () {
        return getUserEmail();
    },
    create: function () {
        return (Router.current().path === '/create');
    },
    isNotLiveWebsite: function () {
        if(!Router.current()) return;
        return (Router.current().path === '/' || Router.current().path === '/create');
    }
});

Template.createMenu.helpers({
    pathForLiveWebsite: function () {
        var website = Websites.findOne(Session.get('editing_website'));
        return '/' + website.sitename;
    }
});

var checkSitename = function ( event ) {
    var value = $(event.target).val(),
        allowedChars = new RegExp("^[a-zA-Z0-9\-]+$");

    if (allowedChars.test(value)) {
        if (value.length < 3) {
            return false;
        };
        return true;
    };
    return false;
}

var checkInputField = function ( event ) {
    var value = $(event.target).val();

    if (value.length === 0) {
        $(event.target).removeClass( "valid" ).addClass( "invalid" );
        return false;
    } else {
        $(event.target).removeClass( "invalid" ).addClass( "valid" );
        Session.set('editing_field_value', value);
        return true;
    };
}

var autohideNavbar = function () {
    $("nav.navbar-fixed-top").autoHidingNavbar({'animationDuration' : 300});
}

var destroyNavbar = function () {
    $("nav.navbar-fixed-top").autoHidingNavbar('destroy');
}

var changeLoginText = function () {
    if(!Meteor.user()) {
        $('a.dropdown-toggle').text("Create Website");
        $('a.dropdown-toggle').addClass("greenBg");
    }
}

Template.home.rendered = function () {
    changeLoginText();    
};

Template.dashboard.rendered = function () {
    changeLoginText();
    window.scrollTo(0, 0);
    autohideNavbar();
};

Template.website.rendered = function () {
    window.scrollTo(0, 0);
    showMap(this.data); 
};

Template.create.rendered = function () {
    window.scrollTo(0, 0);
    showMap(this.data);
    // autohideNavbar();

    $('.sections').sortable({
        containment: 'parent',
        cursor: '-webkit-grabbing',
        placeholder: 'placeholder',
        axis: 'x',
        revert: 300
    });
    $( ".sections" ).disableSelection();
};

Template.dashboard.destroyed = function () {
    destroyNavbar();
};

Template.create.destroyed = function () {
    destroyNavbar();
};

Template.dashboard.helpers({
    numberOfWebsites: function () {
        return Session.get('websitesCount');
    },
    numberOfMyWebsites: function () {
        var count = Websites.find({userId: Meteor.userId()}).count();
        if (count === 1)
            return count + " WEBSITE";
        else
            return count + " WEBSITES";
    },
    IDontHaveWebsites: function () {
        var count = Websites.find({userId: Meteor.userId()}).count();
        if (count === 0)
            return true
        else
            return false
    }
    // website: function () {
    //     return Websites.find({},{sort: {createdAt: -1}});
    // },
//     myWebsite: function () {
//         return Websites.find({userId: Meteor.userId()},{sort: {createdAt: -1}});
//     }
});
}

if (Meteor.isServer) {
    // Kadira.connect('wktuct8YMbkaDMHXc', 'b762b09b-7b2d-4d76-a76c-2843a2baa89d');

    ServiceConfiguration.configurations.remove({
        service: "facebook"
    });
    ServiceConfiguration.configurations.insert({
        service: "facebook",
        appId: "636768589764143",
        secret: "08df277b0663b6beb93f7795843b98f7"
    });


    Meteor.methods({
        getWebsitesCount: function () {
            return Websites.find().count();
        },
        checkDuplicity: function ( sitename ) {
            var sitename = sitename.toLowerCase(),
                exists = Websites.find({sitename:sitename}).count();

            if( exists > 0 ) return false;
            return true;
        }
    });

    Websites.allow({
        insert: function (userId, doc) {
            return (userId && doc.userId === userId);
        },
        update: function (userId, doc, fields, modifier) {
            return doc.userId === userId;
        },
        remove: function (userId, doc) {
            return doc.userId === userId;
        }
    });

    Websites.deny({
        update: function (userId, docs, fields, modifier) {
            return _.contains(fields, 'userId');
        }
    });


}
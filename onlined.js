Websites = new Meteor.Collection("websites");

if (Meteor.isClient) {

    Session.setDefault('editing_field', null);
    Session.setDefault('editing_website', null);
    Session.setDefault('styleOptions', []);
    Session.setDefault('themes', [
        {name:'Default', css: 'default.css'},
        {name:'Elegant', css: 'elegant.css'},
        {name:'Airy', css: 'airy.css'},
        {name:'Starry', css: 'starry.css'},
        {name:'Intense', css: 'intense.css'}
        ]);
    Session.setDefault('alert', null);
    Session.setDefault('autocomplete', null);
    Session.setDefault('hidingNavbar', null);
    Session.set('version', '0.1.1');

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

    Template.registerHelper('toUpperCase', function(str) {
// check(str, String);
if(!str) return;
return str.toUpperCase();
});

////////// Helpers for in-place editing //////////
var makeEditable = function (event, template) {
    preventActionsForEvent(event);

    if(Session.get('editing_field')) return;
    Session.set('editing_field', event.target.id);


    var contentId = event.target.id,
    textContent = event.target.textContent,
    $eventTarget = $(event.target),
    parent = event.target.parentElement,
    tagName = $eventTarget.get(0).tagName,
    textAlign = $eventTarget.css('text-align'),
    fontFamily = $eventTarget.css('fontFamily'),
    fontSize = $eventTarget.css('fontSize'),
    input;


    if (tagName === "H1" || tagName === "H2" || tagName === "H3" || tagName === "H4" || tagName === "H5" || tagName === "H6") {
        // it's a text field
        if (contentId === "address") {
            $(event.target.nextElementSibling).toggle();
        } else {
            input = '<input id="input" class="textInput" style="text-align:'+textAlign+';font-size:'+fontSize+';font-family:'+fontFamily+';" type="text" value="'+textContent+'"/>';

            $( event.target ).before( '<'+tagName+' id="'+contentId+'">'+ input + '</'+tagName+'>');
        }
    
        $( event.target ).hide();
    }
    
    if (tagName === "P") {
        var lines = countLines(contentId);
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

        input = '<input id="input" class="textInput" type="text" placeholder="your '+ parent.id + ' url here" value="'+website.content[id]+'"/>';
        
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

var registerUser = function ( event, template ) {
    var email = trimInput(template.find('#register-email').value),
        password = template.find('#register-password').value,
        sitename = template.find('.textInput').value;

        console.log('registering user with email: ' + email + ", password: " + password);

    if (isValidPassword(password)) {
        Accounts.createUser({email: email, password : password}, function(err){
            if (err) {
                console.log(err);
                showAlert(err.reason);
            } else {
                console.log('registered and logged in with sitename:'+sitename);
                createDefaultWebsite(sitename);
                Router.go('create');
            }
        });
    }

    return false;
}

var showAlert = function (alert) {
    $('div.alert').text(alert).slideDown(300).delay(2000).slideUp(300);
};

var preventActionsForEvent = function (event) {
    event.preventDefault();
    event.stopPropagation();
};

var createDefaultWebsite = function ( sitename ) {
    var website_id = Websites.insert({
        createdAt: new Date(),
        css: 'css/default.css',
        sitename: sitename,
        userId: Meteor.userId(),
        content: {
            email: getUserEmail(),
            title: "Onlined",
            tagline: "Create your website in minutes",
            heading: "What is it that makes onlined special?",
            paragraph: "Editing your content directly on the page. Click on this text to edit it. Editing your content directly on the page. Click on this text to edit it. Editing your content directly on the page. Click on this text to edit it. Editing your content directly on the page. Click on this text to edit it.",
            logo: "draglogo.jpg",
            topImage: "topImage.jpg",
            galleryImages: [
            {position: 0, src:"family01.jpg", small:"family01small.jpg"},
            {position: 1, src:"family02.jpg", small:"family02small.jpg"},
            {position: 2, src:"family03.jpg", small:"family03small.jpg"},
            {position: 3, src:"family04.jpg", small:"family04small.jpg"}
            ],
            highlightImages: [ 
            {position: 0, src:"highlightImage01.jpg"}, 
            {position: 1, src:"highlightImage02.jpg"},
            {position: 2, src:"highlightImage03.jpg"},
            {position: 3, src:"highlightImage04.jpg"}
            ], 
            textColumns1Heading: "You will love this!",
            textColumns2Heading: "Unbelievable",
            textColumns3Heading: "FAST",
            textColumns1Text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur sit in atque quasi repellendus rem reprehenderit veritatis, ratione similique deleniti, porro itaque error repudiandae ad saepe fugiat quas! Tenetur ea eius assumenda quaerat nam facilis. Pariatur fugit obcaecati quibusdam dolor hic, mollitia soluta magni, amet vitae sit officiis maiores sed!",
            textColumns2Text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae vitae voluptatibus, voluptas corporis ipsum, ipsa eos officiis, recusandae incidunt veritatis ipsam cum cupiditate natus in est unde repudiandae eligendi at voluptatum sit mollitia non, possimus tenetur iure voluptate. Sapiente quia consequatur perferendis laboriosam ea rerum, ab molestias possimus temporibus dolores!",
            textColumns3Text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem maxime adipisci at nemo cupiditate omnis qui, incidunt, aliquam officia molestiae temporibus ut fuga quas accusamus maiores quod nesciunt dignissimos laudantium ullam nam quo, repudiandae nisi! Qui fugiat unde exercitationem voluptatum earum, rerum nesciunt molestiae, incidunt labore est praesentium ut excepturi.",
            phoneNumber: "00420 602 259 666", 
            openingHoursTitle: "opening hours",
            monday: "MON", tuesday: "TUE", wednesday: "WED", thursday: "THU", friday: "FRI", saturday: "SAT", sunday: "SUN",
            mondayHours: "8-18", tuesdayHours: "8-18", wednesdayHours: "8-18", thursdayHours: "8-18", fridayHours: "8-18",
            saturdayHours: "closed", sundayHours: "closed",
            firstProduct: "Product ONE",
            firstProductDescription: "Toto je one brutalny produkt no nekup to. Toto je brutalny produkt no nekup to.",
            firstProductImage: "draglogo.jpg",
            secondProduct: "Product TWO",
            secondProductDescription: "Toto je two brutalny produkt no nekup to. Toto je brutalny produkt no nekup to.",
            secondProductImage: "draglogo.jpg",
            teamTitle: "team members", 
            firstTeamMember: "Jano Mrazik", firstTeamMemberTagline: "stale sa flaka", firstTeamMemberImage: "draglogo.jpg",
            secondTeamMember: "Jano Mrazik 2", secondTeamMemberTagline: "stale sa flaka 2", secondTeamMemberImage: "draglogo.jpg",
            thirdTeamMember: "Jano Mrazik 3", thirdTeamMemberTagline: "stale sa flaka 3", thirdTeamMemberImage: "draglogo.jpg",
            fourthTeamMember: "Jano Mrazik 4", fourthTeamMemberTagline: "stale sa flaka 4", fourthTeamMemberImage: "draglogo.jpg",
            address: "Krizikova 52, Praha 8, Czech Republic",
            latLng: {lat:50.092547, lng:14.45133999999996},
            twitter: "",
            youtube: "",
            facebook: "",
            instagram: ""
        }
    });
Session.set('editing_website', website_id);
};

var getUserEmail = function () {
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

    var editingWebsite = Websites.findOne(Session.get('editing_website'));
    if(!editingWebsite) return;
    
    var address = editingWebsite.content.address,
        latLng = editingWebsite.content.latLng,
        mapOptions = {
            scrollwheel: false,
            center: new google.maps.LatLng(latLng.lat, latLng.lng),
            zoom: 13
        },
        map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions),
        input = (document.getElementById('input')),
        autocomplete = new google.maps.places.Autocomplete(input),
        infowindow = new google.maps.InfoWindow(),
        marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        });


    autocomplete.bindTo('bounds', map);

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
        }

        var editingWebsite = Session.get('editing_website');

        Websites.update({_id:editingWebsite},{ $set: { 
            'content.address': place.formatted_address,
            'content.latLng': {lat:place.geometry.location.k, lng:place.geometry.location.B}
        }
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

        infowindow.setContent('<div><strong>' + place.name + '</strong>');
        infowindow.open(map, marker);
    });
};

var showMap = function (website) {
    var address = website.content.address,
        latLng = website.content.latLng,
        mapOptions = {
            scrollwheel: false,
            center: new google.maps.LatLng(latLng.lat, latLng.lng),
            zoom: 13
        },
        map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions),

        infowindow = new google.maps.InfoWindow(),
        marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        });
    
    infowindow.close();
    marker.setVisible(false);

    map.setCenter(latLng);
    map.setZoom(17);
    
    marker.setIcon(({
        url: "logo.png",
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(latLng);
    marker.setVisible(true);

    infowindow.setContent('<div><strong>' + address + '</strong>');
    infowindow.open(map, marker);
};

var saveFile = function ( id, file) { 
    reader = new FileReader(),

    reader.to = id;
    reader.gallery = (id.toLowerCase().indexOf("gallery") >= 0) ? true : false;
    if(reader.gallery) {
        reader.to = id.slice(0,-1);
        reader.position = id.slice(-1);
    }
    console.log('saving file: '+file+" to: "+id);

    reader.onload = function(event) {
        var websiteId = Session.get('editing_website');
        var setModifier = { $set: {} };

        if (this.gallery)
        {
            //it is a gallery image, get a position from id
            setModifier.$set['content.'+this.to+'.'+this.position+'.small' ] = event.target.result;
            setModifier.$set['content.'+this.to+'.'+this.position+'.src' ] = event.target.result;
        } else {
        //it is a single image, no position needed
            setModifier.$set['content.'+this.to ] = event.target.result;
         }

        Websites.update({_id:websiteId}, setModifier, function (error, numOfAffectedDocs) {
            if(error){
                console.log('error:'+error);
            } else {
                console.log('numOfAffectedDocs:'+numOfAffectedDocs);
            }
        });
    };

    reader.readAsDataURL(file);
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

Template.create.events({
    'click p,h1,h2,h3,h4,h5,h6': function ( event, template ) {
        countLines(event.target.id);
        makeEditable( event, template );
    },
    'click .link' : function ( event, template ) {
        makeEditable( event, template );
    },
    'keyup #input' : function( event, template ) {
        if (event.which === 27) {
            // escape pressed
            preventActionsForEvent(event);
            $(event.target).blur();
        }
        if (event.which === 13) {
            // enter pressed
            preventActionsForEvent(event);

            var websiteId = Session.get('editing_website'),
            parent = event.target.parentElement,
            value = event.target.value,
            setModifier = { $set: {} };

            setModifier.$set['content.'+ parent.id ] = value;
            Websites.update({_id:websiteId}, setModifier);

            $(event.target).blur();
        }
    },
    'focusout #input' : function ( event, template ) {
        preventActionsForEvent(event);
        var parent = event.target.parentElement,
        sibling = parent.nextSibling,
        social = ['twitter', 'youtube', 'facebook', 'instagram'];


        if(parent.id === "address") {
            sibling = parent.previousElementSibling;
            $(parent).toggle();
        } else if (_.contains(social, parent.id) ) {
            sibling = event.target.nextElementSibling; 
            $(event.target).remove();
        } else {    
            $(parent).remove(); // calls focusout event 
        }

        Session.set('editing_field', null);
        $(sibling).show();
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
        id = event.target.parentElement.id;

        console.log('dropped file on id:'+id);
        var file = event.originalEvent.dataTransfer.files[0];
        saveFile(id, file);
    },
    'click .overlay' : function ( event, template ) {
        preventActionsForEvent( event );
        $(event.target.nextElementSibling).click();
    },
    'change input[type=file]' : function ( event, template ) {
        preventActionsForEvent( event );
        var id = event.target.parentElement.id;
        var file = event.target.files[0];
        saveFile(id, file);
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

Template.dashboard.events({
    'click #register-sitename' : function ( event, template ) {

        var parent = $('#register-sitename'),
            input = parent.find('input'),
            label = parent.find('span');

        parent.removeClass( 'pulseEffect' );

        $(input).val("");

        label.fadeOut(200);
        input.delay(250).fadeIn(200, function(){
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
        var parent = $(event.target).parent();

        if ( checkFields( event ) && checkDuplicity ( event ) ) {
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

        if ( checkFields( event ) && checkDuplicity ( event ) ) {
            parent.removeClass( "invalid" ).addClass( "valid" );
        } else {
            parent.removeClass( "valid" ).addClass( "invalid" );
        }
        // if( value.length > 3 && value.indexOf(' ') < 0) {
        //     parent.removeClass("invalid").addClass("valid");
        // } else {
        //     parent.removeClass("valid").addClass("invalid");
        // }

        if (event.which === 13) {
            if ( checkFields( event ) && checkDuplicity ( event ) ) {
                if(Meteor.user()) {
                    blurCreateWebsiteInput();
                    createDefaultWebsite(sitename);
                    Router.go('create');    
                } else {
                    var form = $('div.getStartedForm'),
                        inputs = form.find('input'),
                        top = form.css('top');
                    
                    if(top === "0px") {$('div.getStartedForm').animate({top:"50"}, 300);}
                    if(top === "50px") {$('div.getStartedForm').animate({top:"0"}, 300);}

                    $(inputs).val("");
                }
            } else {
                $('.textInput').animate({'margin-left':'-5px'},70).animate({'margin-left':'5px'}, 70).animate({'margin-left':'-5px'},70).animate({'margin-left':'0px'}, 70);
            }
        };
    },
    'click .myWebsiteListItem' : function ( event, template ) {
        preventActionsForEvent( event );
        Session.set('editing_website', this._id);
        Router.go('create');
    },
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

    'mouseenter .myWebsiteListItem' : function ( event, template ) {
        websiteListItemMouseEnter ( event );
        $(event.target).find('.editRow').slideDown();
    },

    // my website list item
    'mouseleave .myWebsiteListItem' : function ( event, template ) {
        websiteListItemMouseLeave( event );
        $(event.target).find('.editRow').slideUp();
    },

    'click .edit' : function ( event , template ) {
        preventActionsForEvent( event );
        Session.set('editing_website', this._id);
        Router.go('/create');
    },

    'click .delete' : function ( event , template ) {
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

Template.create.helpers({
    editImageText: function () {
        return "click or drag&drop";
    },
    style: function () {
        var str = this.css;
        return str.substring(4, str.length - 4);
    },
    goHome: function () {
        Router.go('/');
    },
    galleryImages: function () {
        return this.content.galleryImages;
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
        return Websites.find().count();
    },
    websites: function () {
        return Websites.find({},{sort: {createdAt: -1}});
    }
});

Template.dashboard.helpers({
    numberOfWebsites: function () {
        return Websites.find().count();
    },
    websites: function () {
        return Websites.find({},{sort: {createdAt: -1}});
    },
    myWebsites: function () {
        return Websites.find({userId:Meteor.userId()},{sort: {createdAt: -1}});
    }
});

Template.selectStyle.helpers({
    styleOptions: function () {
        return Session.get('styleOptions');
    },
    selectedStyle: function () {
        var str = Websites.findOne(Session.get('editing_website')).css;
        return str.substring(4, str.length - 4);
    }
});

Template.selectStyle.events({
    'click li': function (e,t) {
        var styleId = $(e.target).data('styleid');

        if(styleId === undefined) return;

        var styleCss = Session.get('styleOptions')[styleId].css,
            currentStyle = 'css/' + styleCss,
            editingWebsite = Session.get('editing_website');
        
        if (editingWebsite) {

            Websites.update(
                {_id: editingWebsite},
                { $set: { css: currentStyle}}
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
        w = Websites.findOne(this.id);

        if (Router.current().path === '/create' && w.sitename)
            return o + '/' + w.sitename.toUpperCase();
        else 
            return o;
    }
});

Template.website.helpers({
    style: function () {
        var str = this.css;
        return str.substring(4, str.length - 4);
    },
    email: function () {
        return getUserEmail();
    },
    galleryImages: function () {
        return this.content.galleryImages;
    }
});

Template.layout.helpers({
    alert: function () {
        console.log('logging from helpers alertMessage: '+ Session.get('alertMessage'));
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

var checkFields = function ( event ) {
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

var checkDuplicity = function ( event ) {
    var value = $(event.target).val(),
        exists = Websites.find({sitename:value}).fetch();
    if( exists.length > 0 ) { return false; }
    return true;
}

var autohideNavbar = function () {
    $("nav.navbar-fixed-top").autoHidingNavbar({'animationDuration' : 300});
}

var destroyNavbar = function () {
    console.log('destroyNavbar');
    $("nav.navbar-fixed-top").autoHidingNavbar('destroy');
}

Template.dashboard.rendered = function () {
    window.scrollTo(0, 0);
    $('.editRow').slideUp(0);
    autohideNavbar();
};

Template.website.rendered = function () {
    window.scrollTo(0, 0);
    var website = this.data;
    showMap(website); 
};

Template.create.rendered = function () {
    window.scrollTo(0, 0);
    setupMap();
    autohideNavbar();
};

Template.dashboard.destroyed = function () {
    destroyNavbar();
};

Template.create.destroyed = function () {
    destroyNavbar();
};


Template.selectStyle.rendered = function () {
    var themes = Session.get('themes');
    var styleOptions = [];

    themes.forEach(function(value, index){
        styleOptions.push({name:value.name, value:index, css:value.css});  
    });

    Session.set('styleOptions', styleOptions);
};
}

if (Meteor.isServer) {

    ServiceConfiguration.configurations.remove({
        service: "facebook"
    });
    ServiceConfiguration.configurations.insert({
        service: "facebook",
        appId: "636768589764143",
        secret: "08df277b0663b6beb93f7795843b98f7"
    });

    Meteor.publish('allUsers', function () {
        return Meteor.users.find();
    });

    Meteor.publish('allWebsites', function () {
        return Websites.find();
    });

    Meteor.publish('editWebsite', function (id) {
        return Websites.find({_id:id});
    });

    Meteor.publish('liveWebsite', function (sitename) {
        return Websites.find({sitename:sitename});
    });
}
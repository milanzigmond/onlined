Websites = new Meteor.Collection("websites");

if (Meteor.isClient) {

    Meteor.subscribe('allUsers');
    Meteor.subscribe('allWebsites');

    Session.setDefault('editing_field', null);
    Session.setDefault('editing_website', null);
    Session.setDefault('styleOptions', []);
    Session.setDefault('currentStyle', null);
    Session.setDefault('themes', [
        {name:'styl1', css: 'dark.css'},
        {name:'styl2', css: 'styl2.css'},
        {name:'styl3', css: 'styl3.css'},
        {name:'styl4', css: 'styl4.css'},
        {name:'styl5', css: 'styl5.css'},
        {name:'Darkly', css: 'darkly.css'},
        {name:'Flatly', css: 'flatly.css'},
        {name:'Paper', css: 'paper.css'},
        {name:'Readable', css: 'readable.css'},
        {name:'Slate', css: 'slate.css'}
        ]);
    Session.setDefault('alert', null);
    Session.setDefault('autocomplete', null);
    Session.setDefault('slider', null);

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

// SLIDER START

function Slider ( container, nav ) {
    this.container = container;
    this.nav = nav;
    this.imgs = this.container.find('img');
    this.imgWidth = this.imgs[0].width;
    this.imgsLen = this.imgs.length;

    this.current = 0;
};

Slider.prototype.transition = function(coords) {
    this.container.animate({
        'margin-left': coords || -(this.current * this.imgWidth)
    });
};

Slider.prototype.setCurrent = function(dir) {
    var pos = this.current;

pos += ( ~~( dir == 'next') || -1); // add or subtract 1
this.current = (pos < 0) ? this.imgsLen - 1 : pos % this.imgsLen;

return pos;
};

// SLIDER END

////////// Helpers for in-place editing //////////
var makeEditable = function (event, template) {
    preventActionsForEvent(event);

    if(Session.get('editing_field')) return;
    Session.set('editing_field', event.target.id);

    var contentId = event.target.id,
    textContent = event.target.textContent,
    $eventTarget = $(event.target),
    tagName = $eventTarget.get(0).tagName,
    textAlign = $eventTarget.css('text-align'),
    fontFamily = $eventTarget.css('fontFamily'),
    fontSize = $eventTarget.css('fontSize'),
    lines = countLines(contentId);

    if (tagName === "H1" || tagName === "H2" || tagName === "H3" || tagName === "H4" || tagName === "H5" || tagName === "H6") {
// it's a text field

if (contentId === "address") {
    $(event.target.nextElementSibling).toggle();
} else {
    var input = '<input id="input" class="textInput" style="text-align:'+textAlign+';font-size:'+fontSize+';font-family:'+fontFamily+';" type="text" placeholder="" value="'+textContent+'"/>';
    $( event.target ).before( '<'+tagName+' id="'+contentId+'">'+ input + '</'+tagName+'>');
// $( event.target ).before(input);
}
$( event.target ).hide();
}
else if (tagName === "P") {
// it's a text area

var input = '<textarea id="input" style="text-align:'+textAlign+';font-size:'+fontSize+';font-family:'+fontFamily+';" rows="'+lines+'" cols="50">'+textContent+'</textarea>';

$( event.target ).before( '<p id="'+contentId+'">'+ input + '</p>');
// $( event.target ).before(input);
$( event.target ).hide();
}
Deps.flush();
activateInput(template.find('#input'));
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

var activateInput = function (input) {
    input.focus();
    input.select();
};

var createDefaultWebsite = function ( sitename ) {
    var website_id = Websites.insert({
        createdAt: new Date(),
        css: Session.get('currentStyle'),
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
            sliderImages: [ 
            {position: 0, src:"sliderImage01.jpg"}, 
            {position: 1, src:"sliderImage02.jpg"},
            {position: 2, src:"sliderImage03.jpg"},
            {position: 3, src:"sliderImage04.jpg"}
            ], 
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
            latLng: {lat:50.092547, lng:14.45133999999996}
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

    var editingWebsite = Websites.findOne(Session.get('editing_website')),
    address = editingWebsite.content.address,
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
            console.log('place.geometry.location:'+place.geometry.location);
map.setZoom(17);  // Why 17? Because it looks good.
}

var editingWebsite = Session.get('editing_website');

Websites.update({_id:editingWebsite},{ $set: { 
    'content.address': place.formatted_address,
    'content.latLng': {lat:place.geometry.location.k, lng:place.geometry.location.B}
}});

marker.setIcon(/** @type {google.maps.Icon} */({
    url: place.icon,
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

var saveFile = function ( event, file) { 
    reader = new FileReader(),

    // id = event.target.id;
    id = event.target.parentElement.id;

    reader.to = id;
    reader.gallery = (id.toLowerCase().indexOf("gallery") >= 0) ? true : false;
    reader.slider = (id.toLowerCase().indexOf("slider") >= 0) ? true : false;
    if(reader.gallery || reader.slider) {
        reader.to = id.slice(0,-1);
        reader.position = id.slice(-1);
    }
    console.log('saving file: '+file+" to: "+id);
    
    reader.onload = function(event) {
        var websiteId = Session.get('editing_website');
        var setModifier = { $set: {} };

        if (this.gallery || this.slider)
        {
            //it is a gallery image, get a position from id
            setModifier.$set['content.'+this.to+'.'+this.position+'.small' ] = event.target.result;
            setModifier.$set['content.'+this.to+'.'+this.position+'.src' ] = event.target.result;
        } else {
        //it is a single image, no position needed
            setModifier.$set['content.'+this.to ] = event.target.result;
    }

    Websites.update({_id:websiteId}, setModifier);
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
        console.log('focusout on:'+ event.target.parentElement.id);
        preventActionsForEvent(event);
        var parent = event.target.parentElement,
        sibling = parent.nextSibling;

        if(parent.id === "address") {
            sibling = parent.previousElementSibling;
            $(parent).toggle();
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
        var file = event.originalEvent.dataTransfer.files[0];
        saveFile(event, file);
    },
    'click .overlay' : function ( event, template ) {
        preventActionsForEvent( event );
        $(event.target.nextElementSibling).click();
    },
    'change input[type=file]' : function ( event, template ) {
        preventActionsForEvent( event );
        var file = event.target.files[0];
        saveFile(event, file);
    }, 
    'click #sliderGalleryNav img' : function ( event, template ) {
        preventActionsForEvent( event );
        console.log('slider arrow clicked: '+ slider + ', '+ $(event.target).data('dir'));
        if (!slider) return;
        slider.setCurrent( $(event.target).data('dir') );
        slider.transition();
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

        $(input).val("");

        // label.fadeTo("fast", 0);
        label.fadeOut(200);
        input.delay(250).fadeIn(200, function(){
            this.focus();
        });
    },
    'focusout .textInput' : function ( event, template ) {
        var parent = $(event.target).parent();
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
    editing_website: function () {
        return Websites.findOne(Session.get('editing_website'));
    },
    goHome: function () {
        Router.go('/');
    },
    galleryImages: function () {
        return this.content.galleryImages;
    },
    sliderImages: function () {
        return this.content.sliderImages;
    },
    highlightImages: function () {
        return this.content.highlightImages;
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
    }
});

Template.selectStyle.events({
    'click li': function (e,t) {
        var styleId = $(e.target).data('styleid');
        var styleCss = Session.get('styleOptions')[styleId].css;
        styleCss = 'css/'+styleCss;
        Session.set('currentStyle', styleCss);
    }
});

Template.website.helpers({
    email: function () {
        return getUserEmail();
    },
    galleryImages: function () {
        return this.content.galleryImages;
    },
    sliderImages: function () {
        return this.content.sliderImages;
    }
});

Template.layout.helpers({
    onlinedTitle: function () {
        if (!Router.current()) return;

        var o = "ONLINED.AT",
        id = Session.get('editing_website'),
        w = Websites.findOne(id);

        if (w && Router.current().path === '/create' && w.sitename)
            return o + '/' + w.sitename.toUpperCase();
            // return o + w.sitename.toUpperCase();
        else 
            return o;
    },
    alert: function () {
        console.log('logging from helpers alertMessage: '+ Session.get('alertMessage'));
        return Session.get("alertMessage");
    },
    email: function () {
        return getUserEmail();
    },
    create: function () {
        return (Router.current().path === '/create');
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

Template.layout.events({
    'click .fancybox': function (e,t) {
        $('.fancybox').fancybox();
    }
});

Template.dashboard.rendered = function () {
    $('.editRow').slideUp(0);
};

Template.layout.rendered = function () {
    $("nav.navbar-fixed-top").autoHidingNavbar({
        'animationDuration' : 300
    });
};

Template.website.rendered = function () {
    setupMap();

// if (Meteor.user() && Session.get('editing_website')) {
//   Session.set('editing_website', null);  
//   $(".modal").modal('show');
// };
};

Template.create.rendered = function () {
    setupMap();

    slider = new Slider( $('div.sliderGallery ul'), $('#sliderGalleryNav'));

    console.log('rendered : ' + slider);
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

//  Accounts.config({
//     sendVerificationEmail: true, 
//     forbidClientAccountCreation: false
// });

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
}
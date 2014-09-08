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

  if (Accounts._resetPasswordToken) {
    Session.set('resetPassword', Accounts._resetPasswordToken);
  } 

  var DateFormats = {
   since: "YYYY MMMM DD",
   short: "DD MMMM YYYY",
   long: "DD MMMM YYYY HH:mm (dddd)"
  };

  UI.registerHelper("formatDate", function(datetime, format) {
    if (moment) {
      f = DateFormats[format];
      return moment(datetime).format(f);
    }
    else {
      return datetime;
    }
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
        lines = countLines(contentId);

    if (tagName === "H1" || tagName === "H2" || tagName === "H3" || tagName === "H4" || tagName === "H5" || tagName === "H6") {
    // it's a text field
      
      if (contentId === "address") {
        $(event.target.nextElementSibling).toggle();
      } else {
        var input = '<input id="input" class="textInput" style="text-align:'+textAlign+';" type="text" placeholder="" value="'+textContent+'"/>';
        $( event.target ).before( '<'+tagName+' id="'+contentId+'">'+ input + '</'+tagName+'>');
        // $( event.target ).before(input);
      }
      $( event.target ).hide();
    }
    else if (tagName === "P") {
      // it's a text area

      var input = '<textarea id="input" style="text-align:'+textAlign+';" rows="'+lines+'" cols="50">'+textContent+'</textarea>';

      $( event.target ).before( '<p id="'+contentId+'">'+ input + '</p>');
      // $( event.target ).before(input);
      $( event.target ).hide();
    }
    Deps.flush();
    activateInput(template.find('#input'));
  };

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

  var createDefaultWebsite = function () {
    var website_id = Websites.insert({
      createdAt: new Date(),
      css: Session.get('currentStyle'),
      content: {
        email: Meteor.user().emails[0].address,
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
          {position: 3, src:"family04.jpg", small:"family04small.jpg"},
          {position: 4, src:"family05.jpg", small:"family05small.jpg"},
          {position: 5, src:"family06.jpg", small:"family06small.jpg"},
          {position: 6, src:"family07.jpg", small:"family07small.jpg"}
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
        address: "Krizikvova 52, Praha 8, Czech Republic",
        latLng: {lat:50.092547, lng:14.45133999999996}
      }
    });
    Session.set('editing_website', website_id);
  };

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

  var setupSlider = function () {
    var slider = new Slider( $('div.sliderGallery ul'), $('#sliderGalleryNav'));
    slider.nav.find('img').on('click', function() {
      slider.setCurrent( $(this).data('dir') );
      slider.transition();
    });
  }

  var saveFile = function (event) { 
    var file = event.originalEvent.dataTransfer.files[0],
        reader = new FileReader(),
        id = event.target.id;
    
    reader.to = id;
    reader.gallery = (id.toLowerCase().indexOf("gallery") >= 0) ? true : false;
    reader.slider = (id.toLowerCase().indexOf("slider") >= 0) ? true : false;
    if(reader.gallery || reader.slider) {
      reader.to = id.slice(0,-1);
      reader.position = id.slice(-1);
    }
    console.log('saving file: '+file+" to: "+event.target.id);
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

  Template.websiteListItem.helpers({
    email: function () {
      if(this.userId){
        return Meteor.users.findOne(this.userId).emails[0].address;  
      }
      else {
        return "loading";
      }
      
    }
  });

  Template.websiteListItem.events({

    'click .title' : function () {
      Session.set('editing_website', this._id);
      Router.go('create');
    },

    'click .close' : function () {
      Session.set('editing_website', null);
      Websites.remove({_id:this._id});
    }
  });

  Template.userItem.events({
    'click .close' : function () {
      Meteor.users.remove({_id:this._id});
    }
  });

  Template.userItem.helpers({
    email: function () {
      var email;

      if (this.emails) {
        email = this.emails[0].address;
      } else {
        email = this.services.facebook.email;
      }

      return email;
    },
    numberOfWebsites: function () {
      return Websites.find({userId:this._id}).count();
    }
  });

  Template.create.events({
    'click p,h1,h2,h3,h4,h5,h6': function ( event, template ) {

      countLines(event.target.id);

      makeEditable( event, template );
    },
    // 'mouseenter p,h1,h2,h3,h4,h5,h6': function ( event ) {
    //   $(event.currentTarget).addClass("text-info");
    // },
    // 'mouseleave p,h1,h2,h3,h4,h5,h6': function ( event ) {
    //   $(event.currentTarget).removeClass("text-info");
    // },
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
    'dragover .reimg' : function ( event, template ) { 
      preventActionsForEvent(event); 
    },
    'drop .reimg' : function ( event, template ) {
      preventActionsForEvent(event);
      saveFile(event);
    }
  });

  Template.create.helpers({
    editing_website: function () {
      return Websites.findOne(Session.get('editing_website'));
    },
    goHome: function () {
      Router.go('home');
    },
    galleryImages: function () {
      return this.content.galleryImages;
    },
    sliderImages: function () {
      return this.content.sliderImages;
    }
  });

  Template.home.helpers({
    websites: function () {
      return Websites.find({},{sort: {createdAt: -1}});
    },

    users: function () {
      return Meteor.users.find();
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

  Template.form.events({
    'submit form': function( event, template ){
      event.preventDefault();
      event.stopPropagation();

      var sitename = template.find('#input-sitename').value;

      var websiteId = Session.get('editing_website');
      Websites.update({_id:websiteId},{ $set: { 
        'sitename': sitename,
        'userId': Meteor.userId()
      }});
      Router.go('/'+sitename);
    }
  });

  Template.website.helpers({
      email: function () {
        return Meteor.user().emails[0].address;
      },
      galleryImages: function () {
        return this.content.galleryImages;
      },
      sliderImages: function () {
        return this.content.sliderImages;
      }
  });

  Template.layout.helpers({
    alert: function () {
        console.log('logging from helpers alertMessage: '+ Session.get('alertMessage'));
      return Session.get("alertMessage");
    },
    email: function () {

      var email;

      if (Meteor.user().emails) {
        email = Meteor.user().emails[0].address;
      } else {
        email = Meteor.user().services.facebook.email;
      }
      
      console.log('email:'+email);

      return email;
    }
  });

  Template.layout.events({
    'click .fancybox': function (e,t) {
      $('.fancybox').fancybox();
      // preventActionsForEvent(e);
    },
    'click .logout': function (event, Template) {
      Meteor.logout();
      Router.go('home');
    },
    'click .createWebsiteButton': function (event, template) {
      createDefaultWebsite();
      Router.go('create');
    },
    'click #loginFacebook' : function ( event, template ) {
      console.log('click');
      Meteor.loginWithFacebook({
        requestPermissions: ['email'] // http://developers.facebook.com/docs/authentication/permissions/
      }, function (error) {
        if (error) {
          console.log('error:'+error);
        }
      });
    }
  });

  Template.login.events({
    'submit #login-form' : function(e, t){
      e.preventDefault();
      e.stopPropagation();

      var email = trimInput(t.find('#login-email').value)
      , password = t.find('#login-password').value;

        Meteor.loginWithPassword(email, password, function(err){
          if (err) {
            showAlert(err.reason);
            console.log(err);
          }
          else {
            console.log('logged in');
            Router.go('home');
          }
      });
        return false; 
      }
  });

  Template.register.events({
    'submit #register-form' : function(event, template) {
      preventActionsForEvent(event)

      var email = trimInput(template.find('#register-email').value),
          password = template.find('#register-password').value;

      if (isValidPassword(password)) {
        Accounts.createUser({email: email, password : password}, function(err){
          if (err) {
              console.log(err);
              showAlert(err.reason);
          } else {
            console.log('registered and logged in');
            Router.go('home');
          }
        });
      }
      
      return false;
    }
  });

  Template.passwordRecovery.helpers({
    resetPassword : function(t) {
      return Session.get('resetPassword');
    }
  });

  Template.passwordRecovery.events({
    'submit #recovery-form' : function(e, t) {
      e.preventDefault()
      var email = trimInput(t.find('#recovery-email').value)

      if (isNotEmpty(email) === isEmail(email)) {
        Session.set('loading', true);
        Accounts.forgotPassword({email: email}, function(err){
          if (err)
            Session.set('displayMessage', 'Password Reset Error &amp; Doh')
          else {
            Session.set('displayMessage', 'Email Sent &amp; Please check your email.')
          }
          Session.set('loading', false);
        });
      }
      return false; 
    },

    'submit #new-password' : function(e, t) {
      e.preventDefault();
      var pw = t.find('#new-password-password').value;
      if (isNotEmpty(pw) === isValidPassword(pw)) {
        Session.set('loading', true);
        Accounts.resetPassword(Session.get('resetPassword'), pw, function(err){
          if (err)
            Session.set('displayMessage', 'Password Reset Error &amp; Sorry');
          else {
            Session.set('resetPassword', null);
          }
          Session.set('loading', false);
        });
      }
      return false; 
    }
  });

  Template.website.rendered = function () {
    setupMap();
    setupSlider();

    if (Meteor.user() && Session.get('editing_website')) {
      Session.set('editing_website', null);
      $(".modal").modal('show');
    };
  };

  Template.create.rendered = function () {
    setupMap();
    setupSlider();

    $('img').each(function(n) {
        n += 1;
        $(this).wrap('<figure class="tint t'+ n + '"></figure>');
      });
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

  // first, remove configuration entry in case service is already configured
  ServiceConfiguration.configurations.remove({
    service: "facebook"
  });
  ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: "636768589764143",
    secret: "08df277b0663b6beb93f7795843b98f7"
  });

  // first, remove configuration entry in case service is already configured
  // Accounts.loginServiceConfiguration.remove({
  //   service: "google"
  // });
  // Accounts.loginServiceConfiguration.insert({
  //   service: "google",
  //   clientId: "yourClientId",
  //   secret: "yourSecret"
  // });


  Meteor.publish('allUsers', function () {
    return Meteor.users.find();
  });

  Meteor.publish('allWebsites', function () {
    return Websites.find();
  });
}
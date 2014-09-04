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
    {name:'Amelia', css: 'amelia.css'},
    {name:'Cerulean', css: 'cerulean.css'},
    {name:'Cosmo', css: 'cosmo.css'},
    {name:'Cyborg', css: 'cyborg.css'},
    {name:'Darkly', css: 'darkly.css'},
    {name:'Flatly', css: 'flatly.css'},
    {name:'Journal', css: 'journal.css'},
    {name:'Lumen', css: 'lumen.css'},
    {name:'Paper', css: 'paper.css'},
    {name:'Readable', css: 'readable.css'},
    {name:'Sandstone', css: 'sandstone.css'},
    {name:'Simplex', css: 'simplex.css'},
    {name:'Slate', css: 'slate.css'},
    {name:'Spacelab', css: 'spacelab.css'},
    {name:'Superhero', css: 'superhero.css'},
    {name:'United', css: 'united.css'},
    {name:'Yeti', css: 'yeti.css'},
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
  }

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

  // Returns an event map that handles the "escape" and "return" keys and
  // "blur" events on a text input (given by selector) and interprets them
  // as "ok" or "cancel".
  var okCancelEvents = function (selector, callbacks) {
    var ok = callbacks.ok || function () {};
    var cancel = callbacks.cancel || function () {};

    var events = {};
    events['keyup '+selector+', keydown '+selector+', focusout '+selector] =
    function (evt) {
      if (evt.type === "keydown" && evt.which === 27) {
          // escape = cancel
          cancel.call(this, evt);

        } else if (evt.type === "keyup" && evt.which === 13 ||
         evt.type === "focusout") {
          // blur/return/enter = ok/submit if non-empty
          var value = String(evt.target.value || "");
          if (value)
            ok.call(this, value, evt);
          else
            cancel.call(this, evt);
        }
      };

      return events;
    };

    var makeEditable = function (event, template) {
      preventActionsForEvent(event);

      if(Session.get('editing_field')) return;
      Session.set('editing_field', event.target.id);

      var contentId = event.target.id,
          textContent = event.target.textContent,
          $eventTarget = $(event.target),
          tagName = $eventTarget.get(0).tagName;
          
       // $eventTarget.is("h3")
      if (tagName === "H1" || tagName === "H2" || tagName === "H3" || tagName === "H4" || tagName === "H5" || tagName === "H6") {
      // it's a text field
        
        if (contentId === "address") {
          // var input = '<input id="pac-input" class="controls" type="text" placeholder="Enter a location">';
          $(event.target.nextElementSibling).toggle();
          debugger
        } else {
          var input = '<input id="input" class="textInput" type="text" placeholder="" value="'+textContent+'"/>';
          $( event.target ).before( '<'+tagName+' id="'+contentId+'">'+ input + '</'+tagName+'>');
        }
        $( event.target ).hide();
        console.log('it is a one line text field');
      }
      else if (tagName === "P") {
        // it's a text area
        console.log('it is a text area');
        var input = '<textarea id="input" rows="6" cols="50">'+textContent+'</textarea>';

        $( event.target ).before( '<p id="'+contentId+'">'+ input + '</p>');
        $( event.target ).hide();
      }

      debugger
      Deps.flush();
      activateInput(template.find('#input'));
    }

    var makeStatic = function (event, template) {
      preventActionsForEvent(event);

      var value = event.target.value,
          textContent = event.target.textContent,
          $eventTarget = $(event.target),
          parent = event.target.parentElement,
          contentId = parent.id,
          sibling = parent.nextSibling,
          websiteId = Session.get('editing_website'),
          setModifier = { $set: {} };

      if ( event.which === 13 ){
        // enter pressed
        setModifier.$set['content.'+ contentId ] = value;
        Websites.update({_id:websiteId}, setModifier);
      }
      
      console.log('id: '+contentId);
      
      $(sibling).show();
      $(parent).remove();
      // Deps.flush();
      Session.set('editing_field', null);
    }

    var showAlert = function (alert) {
      $('div.alert').text(alert).slideDown(300).delay(2000).slideUp(300);
    }

    var preventActionsForEvent = function (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    var activateInput = function (input) {
      input.focus();
      input.select();
    };

    var createDefaultWebsite = function () {
      var website_id = Websites.insert({
        createdAt: new Date(),
        css: Session.get('currentStyle'),
        content: {
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
          secondProduct: "Product TWO",
          secondProductDescription: "Toto je two brutalny produkt no nekup to. Toto je brutalny produkt no nekup to.",
          teamTitle: "team members", 
          firstTeamMember: "Jano Mrazik", firstTeamMemberTagline: "stale sa flaka",
          secondTeamMember: "Jano Mrazik 2", secondTeamMemberTagline: "stale sa flaka 2",
          thirdTeamMember: "Jano Mrazik 3", thirdTeamMemberTagline: "stale sa flaka 3",
          fourthTeamMember: "Jano Mrazik 4", fourthTeamMemberTagline: "stale sa flaka 4",
          address: "Krizikvova 52, Praha 8, Czech Republic",
          latLng: {lat:50.092547, lng:14.45133999999996}
        }
      });
      Session.set('editing_website', website_id);
    };

    var saveFile = function (file, to) { 
      var reader = new FileReader();
      reader.to = to;
      console.log('saving file: '+file+" to: "+to);
      reader.onload = function(event) {
        var websiteId = Session.get('editing_website');
        var setModifier = { $set: {} };
        setModifier.$set['content.'+this.to ] = event.target.result;
        Websites.update({_id:websiteId}, setModifier);
      };

      reader.readAsDataURL(file);
    };

    var saveGalleryImage = function (gallery, file, position) {
      var reader = new FileReader();
      reader.gallery = gallery;
      reader.position = position;

      reader.onload = function(event) {
        var websiteId = Session.get('editing_website');
        var setModifier = { $set: {} };

        // BUG: This is saving small image also for Slider gallery!!!

        setModifier.$set['content.'+this.gallery+'.'+this.position+'.small' ] = event.target.result;
        setModifier.$set['content.'+this.gallery+'.'+this.position+'.src' ] = event.target.result;
        Websites.update({_id:websiteId}, setModifier);
      };

      reader.readAsDataURL(file);
    }

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
        return this.emails[0].address;
      },
      numberOfWebsites: function () {
        return Websites.find({userId:this._id}).count();
      }
    });

    var setupMap = function () {
      var editingWebsite = Websites.findOne(Session.get('editing_website')),
          address = editingWebsite.content.address,
          latLng = editingWebsite.content.latLng,
          mapOptions = {
            center: new google.maps.LatLng(latLng.lat, latLng.lng),
            zoom: 13
          },
          map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions),
          input = (document.getElementById('pac-input')),
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

        //place.geometry.location.k
        //place.geometry.location.B
        //place.formatted_address

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          console.log('showing viewport');
          map.fitBounds(place.geometry.viewport);
        } else {
          console.log('showing location');
          map.setCenter(place.geometry.location);
          console.log('place.geometry.location:'+place.geometry.location);
          map.setZoom(17);  // Why 17? Because it looks good.
        }

        var editingWebsite = Session.get('editing_website');
        // debugger

        // var setModifier = { $set: {} };
        // setModifier.$set['content.'+this.to ] = event.target.result;
        // Websites.update({_id:websiteId}, setModifier);


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

Template.create.rendered = function () {

      setupMap();

      var slider = new Slider( $('div.sliderGallery ul'), $('#sliderGalleryNav'));
      slider.nav.find('button').on('click', function() {
        // console.log('clicked'+$(this).data('dir'));
        slider.setCurrent( $(this).data('dir') );
        slider.transition();
      });
    };


    Template.create.events({
      'click p,h1,h2,h3,h4,h5,h6': function( event, template ){
        console.log('clicked: '+ event.target);
        makeEditable( event, template );
      }, 
      'mouseenter p,h1,h2,h3,h4,h5,h6': function (event) {
        $(event.currentTarget).addClass("text-info");
      },
      'mouseleave p,h1,h2,h3,h4,h5,h6': function (event) {
        $(event.currentTarget).removeClass("text-info");
      },
      'keydown #input' : function( event, template ){
        if (event.which === 27) {
          // escape pressed
          console.log('escape pressed');
          makeStatic(event, template);
        }
        if (event.which === 13) {
          // enter pressed
          console.log('enter pressed');
          makeStatic(event, template);
        }
      }
    });

    Template.create.helpers({
      editing_website: function () {
        return Websites.findOne(Session.get('editing_website'));
      },
      goHome: function () {
        Router.go('home');
      },
      email: function () {
        return Meteor.user().emails[0].address;
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
        console.log('styleCss:'+styleCss);
        Session.set('currentStyle', styleCss);
      }
    });

    Template.selectStyle.rendered = function () {

      var themes = Session.get('themes');
      var styleOptions = [];

        themes.forEach(function(value, index){
          styleOptions.push({name:value.name, value:index, css:value.css});  
        });

        Session.set('styleOptions', styleOptions);


      // $.get("http://api.bootswatch.com/3/", function (data) {
      //   var themes = data.themes;
      //   var select = $("select");
      //   select.show();

      //   var styleOptions = [];

      //   themes.forEach(function(value, index){
      //     styleOptions.push({name:value.name, value:index, css:value.css});  
      //   });

      //   Session.set('styleOptions', styleOptions);
      // }, "json").fail(function(){
      //   console.log('bottswatch failed to load');
      // });
    };

    

    /*
var okCancelEvents = function (selector, callbacks) {
    var ok = callbacks.ok || function () {};
    var cancel = callbacks.cancel || function () {};

    var events = {};
    events['keyup '+selector+', keydown '+selector+', focusout '+selector] =
    function (evt) {
      if (evt.type === "keydown" && evt.which === 27) {
          // escape = cancel
          cancel.call(this, evt);

        } else if (evt.type === "keyup" && evt.which === 13 ||
         evt.type === "focusout") {
          // blur/return/enter = ok/submit if non-empty
          var value = String(evt.target.value || "");
          if (value)
            ok.call(this, value, evt);
          else
            cancel.call(this, evt);
        }
      };

      return events;
    };
    */

    Template.logo.events({
      'dragover' : function (e) { preventActionsForEvent(e); },

      'drop' : function (e) {
        preventActionsForEvent(e);
        var file = e.originalEvent.dataTransfer.files[0];
        saveFile(file, 'logo');
      }

    // 'change .upload': function(event, template) {
    //   event.preventDefault();
    //   event.stopPropagation();

    //   var file = template.find(".upload").files[0];
    //   saveFile(file);
    // }
  });

    Template.topImage.events({
      'dragover' : function (e) { preventActionsForEvent(e); },

      'drop' : function (e) {
        preventActionsForEvent(e);
        var file = e.originalEvent.dataTransfer.files[0];
        saveFile(file, 'topImage');
      }
    });

    Template.form.events({
      'submit form': function( event, template ){
        event.preventDefault();
        event.stopPropagation();

        var sitename = template.find('#input-sitename').value;

        console.log("sitename: " + sitename);

        var websiteId = Session.get('editing_website');
        Websites.update({_id:websiteId},{ $set: { 
          'sitename': sitename,
          'userId': Meteor.userId()
        }});
        Router.go('/'+sitename);
      }
    });

Template.website.rendered = function () {
  if (Meteor.user() && Session.get('editing_website')) {
    Session.set('editing_website', null);
    $(".modal").modal('show');
  };

};

  // trim helper
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

  Template.layout.helpers({
    alert: function () {
        console.log('logging from helpers alertMessage: '+ Session.get('alertMessage'));
      return Session.get("alertMessage");
    },
    email: function () {
      return Meteor.user().emails[0].address;
    }
  });

  Template.layout.events({
    'click .fancybox': function (e,t) {
      $('.fancybox').fancybox();
      // preventActionsForEvent(e);
      
      console.log('fancybox clicked from tempalte events');
    },
    'click .logout': function (event, Template) {
      Meteor.logout();
      Router.go('home');
    },
    'click .createWebsiteButton': function (event, template) {
      createDefaultWebsite();
      Router.go('create');
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
    'submit #register-form' : function(e, t) {
      e.preventDefault();

      var email = trimInput(t.find('#register-email').value)
      , password = t.find('#register-password').value;

        // Trim and validate the input
        if (isValidPassword(password)) {
          Accounts.createUser({email: email, password : password}, function(err){
            if (err) {
                console.log(err);
                showAlert(err.reason);
              // Inform the user that account creation failed

            } else {
              console.log('registered and logged in');
              Router.go('home');
              // Success. Account has been created and the user
              // has logged in successfully. 
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

  Template.slider.helpers({
    sliderImages: function () {
      // console.log(this.content.sliderImages);
      return this.content.sliderImages;
    }
  });

  Template.slider.events({
      'dragover div.sliderGallery img' : function (e) { preventActionsForEvent(e); },

      'drop div.sliderGallery img' : function (e) {
        preventActionsForEvent(e);
        var file = e.originalEvent.dataTransfer.files[0];
        saveGalleryImage('sliderImages', file, this.position);
      }
    });

  Template.gallery.helpers({
    galleryImages: function () {
      // console.log(this.content.galleryImages);
      return this.content.galleryImages;
    }
  });

  Template.gallery.events({
      'dragover ul.imageGallery li' : function (e) { preventActionsForEvent(e); },

      'drop ul.imageGallery li' : function (e) {
        preventActionsForEvent(e);  
        var file = e.originalEvent.dataTransfer.files[0];
        saveGalleryImage('galleryImages', file, this.position);
      }

      // 'click a.fancybox' : function (e) {
      //   console.log('li clicked:'+ e.target);
      //   preventActionsForEvent(e);
      //   // debugger
      //   $(e.target).fancybox({
      //      afterClose: function(){
      //        $($("[style$='display: none;']")).css("display","");
      //       }
      //   }).click();
      // }
    });

  // Meteor.autorun(function() {
  //   // Whenever this session variable changes, run this function.
  //   var message = Session.get('displayMessage');
  //   if (message) {
  //     alert(message);
  //     Session.set('displayMessage', null);
  //   }
  // });

}

if (Meteor.isServer) {
  Meteor.publish('allUsers', function () {
    return Meteor.users.find();
  });

  Meteor.publish('allWebsites', function () {
    return Websites.find();
  });
}
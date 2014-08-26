Websites = new Meteor.Collection("websites");

if (Meteor.isClient) {

  Session.setDefault('editing_field', null);
  Session.setDefault('editing_website', null);
  Session.setDefault('styleOptions', []);
  Session.setDefault('currentStyle', null);
  Session.setDefault('themes', [
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

  if (Accounts._resetPasswordToken) {
    Session.set('resetPassword', Accounts._resetPasswordToken);
  } 

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
        craetedAt: new Date(),
        css: Session.get('currentStyle'),
        content: {
          title: "Onlined",
          tagline: "Create your website in minutes",
          heading: "What is it that makes onlined special?",
          paragraph: "Editing your content directly on the page. Click on this text to edit it. Editing your content directly on the page. Click on this text to edit it. Editing your content directly on the page. Click on this text to edit it. Editing your content directly on the page. Click on this text to edit it.",
          logo: "sideface.gif",
          topImage: "topImage.jpg"
        }
      });
      Session.set('editing_website', website_id);
    };

    var saveFile = function (file, to) { 
      var reader = new FileReader();
      reader.to = to;
      reader.onload = function(event) {
        var websiteId = Session.get('editing_website');
        var setModifier = { $set: {} };
        setModifier.$set['content.' + this.to] = event.target.result;
        Websites.update({_id:websiteId}, setModifier);
      };

      reader.readAsDataURL(file);
    };

    Template.home.events({
      'click .createWebsiteButton': function (event, template) {
        if(Meteor.userId()) Meteor.logout();
        createDefaultWebsite();
        Router.go('create');
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

    Template.create.events({

      'mouseenter p,h1,h2,h3,h4,h5,h6': function (event,template) {
        $(event.currentTarget).addClass("text-info");
      },

      'mouseleave p,h1,h2,h3,h4,h5,h6': function (event,template) {
        $(event.currentTarget).removeClass("text-info");
      },

      'click p,h1,h2,h3,h4,h5,h6': function (event,template) {
        if(Session.get('editing_field')) return;
        Session.set('editing_field', event.target.id);
        Deps.flush();
        activateInput(template.find('#input'));
      }
    });

    Template.create.helpers({
      editing_website: function () {
        return Websites.findOne(Session.get('editing_website'));
      },
      goHome: function () {
        Router.go('home');
      }
    });

    Template.home.helpers({
      websites: function () {
        return Websites.find({},{sort: {craetedAt: -1}});
      },

      users: function () {
        return Meteor.users.find({});
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

    Template.title.helpers({
      editing: function () {
        return Session.equals('editing_field', 'title');;
      }
    });

    Template.title.events(okCancelEvents(
      'input',
      {
        ok: function (value) {
          Websites.update({_id:this._id}, {$set: {'content.title': value}});
          Session.set('editing_field', null);
        },
        cancel: function () {
          Session.set('editing_field', null);
        }
      }));

    Template.tagline.helpers({
      editing: function () {
        return Session.equals('editing_field', 'tagline');;
      }
    });

    Template.tagline.events(okCancelEvents(
      'input',
      {
        ok: function (value) {
          Websites.update({_id:this._id}, {$set: {'content.tagline': value}});
          Session.set('editing_field', null);
        },
        cancel: function () {
          Session.set('editing_field', null);
        }
      }));

    Template.heading.helpers({
      editing: function () {
        return Session.equals('editing_field', 'heading');;
      }
    });

    Template.heading.events(okCancelEvents(
      'input',
      {
        ok: function (value) {
          Websites.update({_id:this._id}, {$set: {'content.heading': value}});
          Session.set('editing_field', null);
        },
        cancel: function () {
          Session.set('editing_field', null);
        }
      }));

    Template.paragraph.helpers({
      editing: function () {
        return Session.equals('editing_field', 'paragraph');;
      }
    });

    Template.paragraph.events(okCancelEvents(
      'textArea',
      {
        ok: function (value) {
          Websites.update({_id:this._id}, {$set: {'content.paragraph': value}});
          Session.set('editing_field', null);
        },
        cancel: function () {
          Session.set('editing_field', null);
        }
      }));

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

        var email = template.find('#inputEmail').value;
        var username = template.find('#inputUsername').value;
        var password = template.find('#inputPassword').value;

        console.log( 'Submitting form with:' + email + ", password: "+ password + ", username/domain: " + username);

        // Trim and validate the input

        Accounts.createUser({
          email: email, 
          password : password, 
          username: username},
          function(err){
            if (err) {
              // Inform the user that account creation failed
              console.log('user creation failed');
            } else {
              // Success. Account has been created and the user
              // has logged in successfully. 
              var websiteId = Session.get('editing_website');
              Websites.update({_id:websiteId},{ $set: { 'username': username}});
              Router.go('/'+username);
            }
          });
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
      Session.set('displayMessage', 'Error &amp; Too short.')
      return false; 
    }
  };

  Template.login.events({

    'submit #login-form' : function(e, t){
      e.preventDefault();
      // retrieve the input field values
      var email = trimInput(t.find('#login-email').value)
      , password = t.find('#login-password').value;

        // Trim and validate your fields here.... 

        // If validation passes, supply the appropriate fields to the
        // Meteor.loginWithPassword() function.
        Meteor.loginWithPassword(email, password, function(err){
          if (err)
            console.log(err);
          // The user might not have been found, or their passwword
          // could be incorrect. Inform the user that their
          // login attempt has failed. 
          else
          // The user has been logged in.
        console.log('logged in');
      });
        return false; 
      }
  });

  Template.register.events({
    'submit #register-form' : function(e, t) {
      e.preventDefault();
      var email = trimInput(t.find('#account-email').value)
      , password = t.find('#account-password').value;

        // Trim and validate the input
        if (isValidPassword(userPassword)) {
          Accounts.createUser({email: email, password : password}, function(err){
            if (err) {
                console.log(err);
              // Inform the user that account creation failed

            } else {
              console.log('registered and logged in');
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
}
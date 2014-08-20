Websites = new Meteor.Collection("websites");

if (Meteor.isClient) {

  Session.setDefault('editing_field', null);
  Session.setDefault('editing_website', null);

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

  var activateInput = function (input) {
    input.focus();
    input.select();
  };

  var createDefaultWebsite = function () {
    var website_id = Websites.insert({
      craetedAt: new Date(),
      content: {
        title: "Onlined",
        tagline: "Create your website in minutes",
        heading: "What is it that makes onlined special?",
        paragraph: "Editing your content directly on the page. Click on this text to edit it. Editing your content directly on the page. Click on this text to edit it. Editing your content directly on the page. Click on this text to edit it. Editing your content directly on the page. Click on this text to edit it.",
        logo: "sideface.gif"
      }
    });
    Session.set('editing_website', website_id);
  };

  var saveFile = function (file) { 
      var reader = new FileReader();
      
      reader.onload = function(event) {
        console.log(event.target.result);
        var websiteId = Session.get('editing_website');
        Websites.update({_id:websiteId}, {$set: {'content.logo': event.target.result}});
      };

      reader.readAsDataURL(file);
    };

  Template.home.events({
    'click .createWebsiteButton': function (event, template) {
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
    }
  });

  Template.home.helpers({
    websites: function () {
      return Websites.find({},{sort: {craetedAt: -1}});
    }
  });

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
    'dragover' : function (event,template) {
      event.preventDefault();
      event.stopPropagation();
    },

    'drop' : function (event,template) {
      event.preventDefault();
      event.stopPropagation();

      var file = event.originalEvent.dataTransfer.files[0];
      // var file = template.find(".upload").files[0];
      // safeFile(file);
      console.log("dropped file: " + EJSON.stringify(file));
      saveFile(file);
    },

    'change .upload': function(event, template) {
      event.preventDefault();
      event.stopPropagation();

      var file = template.find(".upload").files[0];
      saveFile(file);
    }
  });

  Template.form.events({
      'submit form': function( event ){
        console.log( 'Submitting form!' );
        event.preventDefault();
        event.stopPropagation();
        return false; 
      }
    });
}

if (Meteor.isServer) {

}
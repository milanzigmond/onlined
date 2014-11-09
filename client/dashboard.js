function checkSitename ( event ) {
    var value = $(event.target).val(),
        allowedChars = new RegExp("^[a-zA-Z0-9\-]+$");

    if (allowedChars.test(value)) {
        if (value.length < 3) {
            return false;
        };
        return true;
    };
    return false;
};

function blurCreateWebsiteInput () {
    var parent = $('#register-sitename');
    var input = parent.find('input');
    var label = parent.find('span');

    input.fadeOut(200);
    // label.delay(250).fadeTo("fast", 100);
    label.delay(250).fadeIn(100);
};

function checkDuplicity ( sitename , parent) {
    var sitename = sitename.toLowerCase();

    Meteor.call('checkDuplicity', sitename, function (err, exists) {
        if(exists) {
            var newWebsiteId = Websites.insert({sitename:sitename}, function () {
                Router.go('edit', {sitename: sitename});
            });
            Session.set('editing_website', newWebsiteId);
            blurCreateWebsiteInput();
        } else {
            $('.textInput').animate({'margin-left':'-5px'},70).animate({'margin-left':'5px'}, 70).animate({'margin-left':'-5px'},70).animate({'margin-left':'0px'}, 70);
            parent.removeClass( "valid" ).addClass( "invalid" );
        };
    });
};

Template.dashboard.rendered = function () {
    window.scrollTo(0, 0);
 	autohideNavbar();
};

Template.dashboard.destroyed = function () {
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
        var sitename = Websites.findOne(this._id).sitename;
        Router.go('edit', {sitename: sitename});
    },
    'click .glyphicon-remove' : function ( event , template ) {
        Session.set('editing_website', null);
        Websites.remove({_id:this._id});
    },
    'hover .websiteItemContent' : function ( event, template ) {
        preventActionsForEvent( event );
    }
});
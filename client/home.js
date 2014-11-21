function websiteListItemMouseEnter ( event ) {
    $(event.target).find('.websiteItemOverlay').animate({opacity: 0.1}, 200);
};

function changeLoginText() {
    if(!Meteor.user()) {
        $('a.dropdown-toggle').text("Create Website");
        $('a.dropdown-toggle').addClass("greenBg");
    }
};

var websiteListItemMouseLeave = function ( event ) {
    $(event.target).find('.websiteItemOverlay').animate({opacity: 0.5}, 200);
};  

Template.home.events({
    'mouseenter .websiteListItem' : function ( event, template ) {
        websiteListItemMouseEnter ( event );
    },
    'mouseleave .websiteListItem' : function ( event, template ) {
        websiteListItemMouseLeave( event );
    },
    'hover .websiteItemContent' : function ( event, template ) {
        preventActionsForEvent( event );
    }
});
Template.createMenu.helpers({
    onlinedTitle: function () {

        var o = "ONLINED.AT",
            w = Websites.findOne(this._id);
        
        if (w)
            return o + '/' + w.sitename.toUpperCase();
        else 
            return o;
    },
    livePathData: function () {
        if(!Session.get('editing_website')) return;
        var website = Websites.findOne(Session.get('editing_website'));
        return { sitename: website.sitename };
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
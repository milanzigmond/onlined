Template.selectStyle.created = function () {
    Session.setDefault('styles', [
        {name:"Default Visual Style", class:"default"},
        {name:"Elegant", class:"elegant"},
        {name:"Airy", class:"airy"},
        {name:"Starry", class:"starry"},
        {name:"Intense", class:"intense"}
    ]);
};

Template.selectStyle.helpers({
    styleOptions: function () {
        return Session.get('styles');
    },
    selectedStyle: function () {
        if (!this.website) return;
        var style = this.website.style;

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
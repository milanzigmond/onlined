Template.version.created = function () {
	Session.set('version', '0.3.0');
};


Template.version.helpers({
    version: function () {
        return Session.get('version');
    }
});
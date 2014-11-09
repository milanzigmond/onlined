Template.version.created = function () {
	Session.set('version', '0.2.3');
};


Template.version.helpers({
    version: function () {
        return Session.get('version');
    }
});
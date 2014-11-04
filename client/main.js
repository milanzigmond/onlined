Template.main.helpers({
    alert: function () {
        return Session.get("alertMessage");
    },
    email: function () {
        return getUserEmail();
    },
    creatingWebsite: function () {
        return (Router.current().route.getName() === 'create');
    },
    liveWebsite: function () {
        return (Router.current().route._path === '/:sitename');
    }
});
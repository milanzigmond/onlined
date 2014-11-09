Template.main.helpers({
    alert: function () {
        return Session.get("alertMessage");
    },
    email: function () {
        return getUserEmail();
    },
    creatingWebsite: function () {
        return (Router.current().route.getName() === 'edit');
    },
    liveWebsite: function () {
        return (Router.current().route._path === '/:sitename');
    }
});

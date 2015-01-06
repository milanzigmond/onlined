Meteor.startup(function () {
    return Inject.rawModHtml('addUnresolved', function (html) {
        return html = html.replace('<body>', '<body unresolved fullbleed layout vertical>');
        // return html = html.replace('<body>', '<body unresolved fit layout vertical>');
    });
});
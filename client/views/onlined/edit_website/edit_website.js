/*****************************************************************************/
/* EditWebsite: Event Handlers and Helpers */
/*****************************************************************************/
Template.EditWebsite.events({
  'click .edit' : function (e,t) {
    Session.set("editing", !Session.get('editing'));
  }
  /*
   * Example: 
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */
});

Template.EditWebsite.helpers({
  editing : function () {return Session.get('editing');},
  /*
   * Example: 
   *  items: function () {
   *    return Items.find();
   *  }
   */
});

/*****************************************************************************/
/* EditWebsite: Lifecycle Hooks */
/*****************************************************************************/
Template.EditWebsite.created = function () {
};

Template.EditWebsite.rendered = function () {
};

Template.EditWebsite.destroyed = function () {
};

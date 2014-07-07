/*****************************************************************************/
/* OnlinedIndex: Event Handlers and Helpers */
/*****************************************************************************/
Template.OnlinedIndex.events({
  /*
   * Example: 
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */
});

Template.OnlinedIndex.helpers({
  items : function () {
    return Onlined.find({}, {
      sort: {
        created_at: -1
      }
    });
  },

  isDoneClass : function () {
    return this.is_done ? 'checked' : '';
  }
});

/*****************************************************************************/
/* OnlinedIndex: Lifecycle Hooks */
/*****************************************************************************/
Template.OnlinedIndex.created = function () {
};

Template.OnlinedIndex.rendered = function () {
};

Template.OnlinedIndex.destroyed = function () {
};

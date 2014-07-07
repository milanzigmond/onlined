/*****************************************************************************/
/* TodosCount: Event Handlers and Helpers */
/*****************************************************************************/
Template.TodosCount.events({
  /*
   * Example: 
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */
});

Template.TodosCount.helpers({
  completedCount : function () {
      return Onlined.find({is_done: true}).count();
  },

  totalCount : function () {
    return Onlined.find({}).count();
  }
});

/*****************************************************************************/
/* TodosCount: Lifecycle Hooks */
/*****************************************************************************/
Template.TodosCount.created = function () {
};

Template.TodosCount.rendered = function () {
};

Template.TodosCount.destroyed = function () {
};

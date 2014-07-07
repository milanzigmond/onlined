/*****************************************************************************/
/* TodoItem: Event Handlers and Helpers */
/*****************************************************************************/
Template.TodoItem.events({
  'click [name=is_done]' : function (e, t) {
    var id =  this._id;
    var isDone = t.find('input').checked;
    Onlined.update({_id: id}, {
      $set : {
        is_done : isDone
      }
    });
  }
});

Template.TodoItem.helpers({
  isDoneChecked : function () {
    return this.is_done ? 'checked' : '';
  }
});

/*****************************************************************************/
/* TodoItem: Lifecycle Hooks */
/*****************************************************************************/
Template.TodoItem.created = function () {
};

Template.TodoItem.rendered = function () {
};

Template.TodoItem.destroyed = function () {
};

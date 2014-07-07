/*****************************************************************************/
/* CreateTodoItem: Event Handlers and Helpers */
/*****************************************************************************/
Template.CreateTodoItem.events({
  'submit form' : function (e,t) {
    e.preventDefault();

    var subject = t.find('input').value;
    
    console.log("subject: " + subject);

    Onlined.insert({
      subject: subject,
      created_at: new Date,
      is_done: false,
      user_id: Meteor.userId()
    });

    var form = t.find('form');
    form.reset();
  }
});

Template.CreateTodoItem.helpers({
  /*
   * Example: 
   *  items: function () {
   *    return Items.find();
   *  }
   */
});

/*****************************************************************************/
/* CreateTodoItem: Lifecycle Hooks */
/*****************************************************************************/
Template.CreateTodoItem.created = function () {
};

Template.CreateTodoItem.rendered = function () {
};

Template.CreateTodoItem.destroyed = function () {
};

OnlinedIndexController = RouteController.extend({
  waitOn: function () {
  	Meteor.subscribe('onlined_index');
  },

  data: function () {
  },

  action: function () {
    this.render();
  }
});

OnlinedIndexController = RouteController.extend({
  waitOn: function () {
  	Meteor.subscribe('website_index');
  },

  data: function () {
  },

  onBeforeAction : function () {
  },

  action: function () {
    this.render();
  }
});

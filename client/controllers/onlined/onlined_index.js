OnlinedIndexController = RouteController.extend({
  waitOn: function () {
  	Meteor.subscribe('website_index');
  },

  data: function () {
  },

  onBeforeAction : function () {
  	loadFilePicker('AcPFM4UwSo2NxaxEcHChQz');
  },

  action: function () {
    this.render();
  }
});

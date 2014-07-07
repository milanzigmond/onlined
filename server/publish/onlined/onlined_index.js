/*****************************************************************************/
/* OnlinedIndex Publish Functions
/*****************************************************************************/

Meteor.publish('onlined_index', function () {
  return Onlined.find({user_id:this.userId});
});

/*****************************************************************************/
/* OnlinedIndex Publish Functions
/*****************************************************************************/

Meteor.publish('website_index', function () {
  return Website.find(); 
});

Tracker.autorun(function() {  	
  if (Session.get('sitenameSearchQuery')) {
  	Meteor.subscribe('sitenameSearch', Session.get('sitenameSearchQuery'));
  };
});

Template.searchResults.events({  
  'keyup [type=text]': function( event, template ) {
    Session.set('sitenameSearchQuery', event.target.value);
  }
});

Template.searchResults.helpers({  
  searchResults: function() {
    return Websites.search(Session.get('sitenameSearchQuery'));
  },
  sitenameSearchQuery: function() {
    return Session.get('sitenameSearchQuery');
  }
});
Router.map(function() {
  this.route('home', {path: '/'});
  this.route('create', {path: '/create'});
  this.route('website', { 
	  path: '/:username',
	  data: function() { 
	  	return Websites.findOne({username:this.params.username})
	  }
	});
});
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

var loadCSS = function() {
	var currentStyle = Session.get("currentStyle");
	if (currentStyle) {
		$("link").attr("href", currentStyle);
	};
}

Router.waitOn(loadCSS);
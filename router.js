Router.map(function() {
	this.route('home', {path: '/'});
	this.route('create', {
		path: '/create',

	});
	this.route('website', { 
		path: '/:username',
		waitOn: function () {
			if(Websites.find().count() !== 0){
				var style = Websites.findOne({username:this.params.username},{css:1, _id:0}).css;
				if (style) {
					console.log('style:'+style);
					$("link").attr("href", style);
				};
			}
		},
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
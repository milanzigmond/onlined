function loadjscssfile(filename, filetype){
 if (filetype=="js"){ //if filename is a external JavaScript file
 	var fileref=document.createElement('script')
 	fileref.setAttribute("type","text/javascript")
 	fileref.setAttribute("src", filename)
 }
 else if (filetype=="css"){ //if filename is an external CSS file
 	var fileref=document.createElement("link")
 	fileref.setAttribute("rel", "stylesheet")
 	fileref.setAttribute("type", "text/css")
 	fileref.setAttribute("href", filename)
 }
 if (typeof fileref!="undefined")
 	document.getElementsByTagName("head")[0].appendChild(fileref)
}


Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound',
  loadingTemplate: 'loading'
});

Router.map(function() {
	this.route('home', {path: '/'});
	this.route('create', {path: '/create'});
	this.route('login', {path: '/login'});
	this.route('register', {path: '/register'});
	this.route('website', { 
		path: '/:sitename',
		waitOn: function () {
			if(Websites.find().count() !== 0){
				var style = Websites.findOne({sitename:this.params.sitename},{css:1, _id:0}).css;
				if (style) {
					console.log('style:'+style);
					$("link").attr("href", style);
					// $("link").attr("href", style);
				};
			}
		},
		data: function() { 
			return Websites.findOne({sitename:this.params.sitename})
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
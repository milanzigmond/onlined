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

var clearUnfinishedWebsite = function () {
	console.log("clearUnfinishedWebsite");
	// var editing_website = Session.get("editing_website");
	// if (editing_website) {
	// 	if (!Websites.findOne(editing_website).sitename) {
	// 		Websites.remove(editing_website);
	// 		Session.set('editing_website',null);
	// 	}
	// };
}

Router.configure({
	layoutTemplate: 'layout',
	notFoundTemplate: 'notFound',
	loadingTemplate: 'loading',
	waitOn: function () {
		return Meteor.subscribe('allWebsites');
	}
});

Router.map(function() {
	this.route('app', {
		path: '/',
		template: 'app'	
	});
	this.route('create', {
		path: '/create',
		onBeforeAction: function () {
			if (!Session.get('editing_website')) {
				Router.go('/');
			};
		}
	});
	this.route('login', {path: '/login'});
	this.route('website', { 
		path: '/:sitename'
		// waitOn: function () {
		// 	return Meteor.subscribe('allWebsites');
		// 	// return Websites.findOne({sitename:this.params.sitename})
		// 	// if(Websites.find().count() !== 0){
		// 	// 	var style = Websites.findOne({sitename:this.params.sitename},{css:1, _id:0}).css;
		// 	// 	if (style) {
		// 	// 		console.log('style:'+style);
		// 	// 		// $("link").attr("href", style);
		// 	// 		// $("link").attr("href", style);
		// 	// 	};
		// 	// }
		// },	
		// data: function() {
		// 	// debugger 
		// 	var websiteData = Websites.findOne({sitename:this.params.sitename});
		// 	console.log('data:'+ websiteData);
		// 	return websiteData;
		// }
	});
});

var loadCSS = function() {
	var currentStyle = Session.get("currentStyle");
	if (currentStyle) {
		currentStyle = 'css/'+currentStyle;
		// $("link").attr("href", currentStyle);
		$.get(currentStyle, function (data) {

			var customStyleLink,
				savedStyle,
				routeName = Router.current().route.name,
				websiteNameFull = Router.current().path,	
				websiteName = websiteNameFull.substring(1, websiteNameFull.length);

			console.log('customStyleLink: '+customStyleLink+', savedStyle: '+savedStyle+', routeName: '+routeName+', websiteName: '+websiteName);

			debugger

			$( "link" ).each(function() {
				if($(this).data('custom-style')){
					customStyleLink = this;
				}
			});

			if(customStyleLink) {
				if(routeName === "website") return;
				$(customStyleLink).attr("data-custom-style", currentStyle);
				$(customStyleLink).attr("href", currentStyle);
			} else {
				
				if(websiteName) {
					savedStyle = Websites.findOne({sitename:websiteName},{css:1, _id:0}).css;	
				}
				
				if (savedStyle) {
					$('head').append('<link rel="stylesheet" data-custom-style="'+savedStyle+'" href="'+savedStyle+'" type="text/css" />');
				} else {
					$('head').append('<link rel="stylesheet" data-custom-style="'+currentStyle+'" href="'+currentStyle+'" type="text/css" />');
				};
				
			}


			console.log('css style loaded:'+currentStyle);
            // Stuff that must happen after CSS injection here
        });
	};
}

// Router.waitOn(loadCss);
Router.onBeforeAction('loading');




Sections = new Mongo.Collection("sections");

Sections.helpers({
	username: function () {
		var user = Meteor.users.findOne({_id:this.userId});
		if(user){
			return user.username;
		}
	}, 
	sitename: function () {
		var website = Websites.findOne({_id:this.websiteId});
		if(website){
			return website.sitename;
		}
	}
});

function getDataObjectForSection ( sectionName ) {
	var dataObjects = {
		"largeImage" : {
			image: ""
		},
		"title" : {
			title: "click here to edit the title",
			tagline: "click me to edit the subtitle"
		},
		"intro" : {
			image: "",
			heading: "click to edit heading",
			paragraph: "Editing your content directly on the page. Click on this text to edit it. Editing your content directly on the page. Click on this text to edit it. Editing your content directly on the page. Click on this text to edit it. Editing your content directly on the page. Click on this text to edit it."
		},
		"email" : {
			email: Meteor.user().emails[0].address
		},
		"threeColumns" : {
			textColumns1Heading: "You will love this!",
			textColumns2Heading: "Unbelievable",
			textColumns3Heading: "FAST",
			textColumns1Text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur sit in atque quasi repellendus rem reprehenderit veritatis, ratione similique deleniti, porro itaque error repudiandae ad saepe fugiat quas! Tenetur ea eius assumenda quaerat nam facilis. Pariatur fugit obcaecati quibusdam dolor hic, mollitia soluta magni, amet vitae sit officiis maiores sed!",
			textColumns2Text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae vitae voluptatibus, voluptas corporis ipsum, ipsa eos officiis, recusandae incidunt veritatis ipsam cum cupiditate natus in est unde repudiandae eligendi at voluptatum sit mollitia non, possimus tenetur iure voluptate. Sapiente quia consequatur perferendis laboriosam ea rerum, ab molestias possimus temporibus dolores!",
			textColumns3Text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem maxime adipisci at nemo cupiditate omnis qui, incidunt, aliquam officia molestiae temporibus ut fuga quas accusamus maiores quod nesciunt dignissimos laudantium ullam nam quo, repudiandae nisi! Qui fugiat unde exercitationem voluptatum earum, rerum nesciunt molestiae, incidunt labore est praesentium ut excepturi."
		},
		"gallery" : {
			gallery: [
				{imageId: ""},
				{imageId: ""},
				{imageId: ""},
				{imageId: ""}
			]
		},
		"location" : {
			address: "Krizikova 52, Praha 8, Czech Republic",
			latLng: {lat:50.092547, lng:14.45133999999996}
		},
		"phoneNumber" : {
			phoneNumber: "00420 602 259 666"
		},
		"openingHours" : {
			openingHoursTitle: "opening hours",
			monday: "MON", tuesday: "TUE", wednesday: "WED", thursday: "THU", friday: "FRI", saturday: "SAT", sunday: "SUN", 
			mondayHours: "8-18", tuesdayHours: "8-18", wednesdayHours: "8-18", thursdayHours: "8-18", fridayHours: "8-18", saturdayHours: "closed", sundayHours: "closed"
		},
		"products" : {
			firstProduct: "Product ONE",
			firstProductDescription: "Toto je one brutalny produkt no nekup to. Toto je brutalny produkt no nekup to.",
			firstProductImage: "draglogo.jpg",
			secondProduct: "Product TWO",
			secondProductDescription: "Toto je two brutalny produkt no nekup to. Toto je brutalny produkt no nekup to.",
			secondProductImage: "draglogo.jpg"
		},
		"links" : {
			twitter: "",
			youtube: "",
			facebook: "",
			instagram: ""
		},
		"team" : {
			teamTitle: "team members", 
			firstTeamMember: "Jano Mrazik", firstTeamMemberTagline: "stale sa flaka", firstTeamMemberImage: "draglogo.jpg",
			secondTeamMember: "Jano Mrazik 2", secondTeamMemberTagline: "stale sa flaka 2", secondTeamMemberImage: "draglogo.jpg",
			thirdTeamMember: "Jano Mrazik 3", thirdTeamMemberTagline: "stale sa flaka 3", thirdTeamMemberImage: "draglogo.jpg",
			fourthTeamMember: "Jano Mrazik 4", fourthTeamMemberTagline: "stale sa flaka 4", fourthTeamMemberImage: "draglogo.jpg"
		}
	}
	return dataObjects[ sectionName ];
}

Sections.before.insert(function( userId, doc ) {
	doc.createdAt = new Date();
	doc.userId = userId;
	doc.hidden = false;
	doc.data = getDataObjectForSection( doc.name );
});

Sections.allow({
	insert: function (userId, doc) {
		return (userId && doc.userId === userId);
	},
	update: function (userId, doc, fields, modifier) {
		return doc.userId === userId;
	},
	remove: function (userId, doc) {
		return doc.userId === userId;
	}
});
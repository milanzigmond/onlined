/*
Websites:
_id
ownerId: String
templateId: String
designId: String
sections: Array [sectionId, sectionId, sectionId]
subdomain: String
password: String? 
*/

Websites = new Meteor.Collection("websites");

/*
Sections:
_id
websiteId: Number - which website does it belong to
type: String [header, footer, gallery1, testimonials, ...]
content: Object [headline: "Welcome", tagline: "We make apps"]
*/
Sections = new Meteor.Collection("sections");
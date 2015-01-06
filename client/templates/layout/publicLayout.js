Template.publicLayout.events({
	'core-select paper-tabs': function (event, template) {
		console.log("Selected: " + event.target.selected);
	}
});
Template.home.rendered = function () {

	$("[name='my-checkbox']").bootstrapSwitch();

	TweenLite.to('.pacman', 2, {left:500});
	// TweenLite.to('.pacman', 2, {'-webkit-filter': 'saturate(3)'});
	TweenLite.fromTo('.pacman', 2, {'-webkit-filter': 'blur(7px)'}, {'-webkit-filter': 'saturate(7px)'});

};

Template.home.events({
	'click .btn': function (e,t) {
	}
});
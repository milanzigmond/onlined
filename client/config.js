Meteor.startup( function () {

	AccountsEntry.config({
		// logo: 'logo.png',                  // if set displays logo above sign-in options
		// privacyUrl: '/privacy-policy',     // if set adds link to privacy policy and 'you agree to ...' on sign-up page
		// termsUrl: '/terms-of-use',         // if set adds link to terms  'you agree to ...' on sign-up page
		homeRoute: '/',                    // mandatory - path to redirect to after sign-out
		dashboardRoute: '/',    			  // mandatory - path to redirect to after successful sign-in
		// profileRoute: 'profile',
		passwordSignupFields: 'USERNAME_AND_EMAIL',
		// showSignupCode: true,
		showOtherLoginServices: false      // Set to false to hide oauth login buttons on the signin/signup pages.
	});

});
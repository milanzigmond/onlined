    
    // function updateWebsiteCount() {
    //     console.log('updateWebsiteCount');
    //     Meteor.call('getWebsitesCount', function (err, count) {
    //         Session.set('websitesCount', count); 
    //     });
    // }

    // Websites.find().observe({
    //     added: updateWebsiteCount,
    //     removed: updateWebsiteCount
    // });

    // var DateFormats = {
    //     since: "YYYY MMMM DD",
    //     short: "DD MMMM YYYY",
    //     long: "DD MMMM YYYY HH:mm (dddd)"
    // };

    

// var showMoreVisible = function () {
//     var treshold, target = $('#laod-more');
//     if(!target.length) return;

//     treshold = $(window).scrollTop() + $(window).height() - target.height();

//     if (target.offset().top < treshold) {
//         if (!Session.get('visible')) {
//             Session.set('visible', true);
//             Meteor.setTimeout(function(){Session.set('websitesLimit', Session.get('websitesLimit')+9)}, 200);
//         };
//     } else {
//         if (Session.get('visible')) {
//             Session.set('visible', false);
//         };
//     }

// }

////////// Helpers for in-place editing //////////



// var isGallery = function ( contentId ) {
//     if( !contentId ) return;

//     var websiteId = Session.get('editing_website'),
//         website = Websites.findOne(websiteId),
//         content = website.content[contentId];

//     if(content instanceof Array) {
//         return true;
//     } else {
//         return false;
//     }
// }


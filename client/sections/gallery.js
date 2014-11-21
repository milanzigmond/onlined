function addIndexToArray ( array, sectionId ) {
    if(!array) return;

    for( var i = 0; i < array.length; i++ ) {
        array[i].index = i;
        array[i].sectionId = sectionId;
    };
    return array;
};

Template.gallery.helpers({
	galleryImages: function () {
        return addIndexToArray( this.data.gallery, this._id );
    }
});
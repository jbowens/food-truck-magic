/* 
 * An object for creating standardized thumbnail sizes.
 */
var easyimage = require('easyimage');

/* The thumbnail sizes we use. */
var thumbnailSizes = [
    {
        name: 'tiny-square',
        width: 60,
        height: 60,
        crop: true,
        square: true
    },
    {
        name: 'small-square',
        width: 150,
        height: 150,
        crop: true,
        square: true
    },
    {
        name: 'medium-square',
        width: 300,
        height: 300,
        crop: true,
        square: true
    }
];

exports.Thumbnailer = {

    thumbnailify: function(photo, callback) {
        var original = __dirname + '/../uploads/' + photo.id.toString() + photo.ext;
        console.log("Generating thumbnails for", original);
        for(var i = 0; i < thumbnailSizes.length; i++) {
            /* Generate that shit */
        }
    }

};

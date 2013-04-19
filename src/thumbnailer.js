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
        crop: true
    },
    {
        name: 'small-square',
        width: 150,
        height: 150,
        crop: true
    },
    {
        name: 'medium-square',
        width: 300,
        height: 300,
        crop: true
    }
];

exports.Thumbnailer = {

    thumbnailify: function(photo) {

    }

};

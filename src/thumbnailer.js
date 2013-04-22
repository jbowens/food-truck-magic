/* 
 * An object for creating standardized thumbnail sizes.
 */
var async = require('async');
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

exports.thumbnailSizes = thumbnailSizes;

/* Takes an image extension and returns true
 * iff it's an image format we support (and can thumbnailfy).
 */
exports.isImage = function(ext) {
    var massagedExt;
    if(ext.charAt(0) == '.') {
        massagedExt = ext.slice(1).toLowerCase();
    } else {
        massagedExt = ext.toLowerCase();
    }
    return 'jpg' == massagedExt || 'jpeg' == massagedExt ||
            'gif' == massagedExt || 'png' == massagedExt;
};

exports.Thumbnailer = {

    thumbnailify: function(photo, callback) {
        var original = __dirname + '/../uploads/' + photo.id.toString() + photo.ext;
        console.log("Generating thumbnails for", original);
        async.each(thumbnailSizes, function(size, c) {
            /* Generate that shit */
            var dest = __dirname + '/../uploads/' + size.name + "/" +
                    photo.id.toString() + photo.ext;
            if(size.width == size.height) {
                /* It's a square thumbnail, so let's just use easyimage's thumbnail
                 * function. */
                easyimage.thumbnail({
                    width: size.width,
                    height: size.height,
                    src: original,
                    dst: dest
                }, function(err, image) {
                    if(err) console.error(err);
                    return c(err);
                });
            } else {
                /* TODO: Math and shit. */
                return c(null);
            }
        }, function(err) {
            callback(err);   
        });
    }

};

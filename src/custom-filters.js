/*
 * Custom swig filters
 */
var thumbnailer = require('./thumbnailer.js');

/* Takes an array of strings and returns the strings concatenated
 * together and comma-delimited.
 */
exports.commasep = function(input) {
    if(!input || !(input instanceof Array)) {
        return input;
    }
    return input.join(', ');
};

/* Takes a photo and a size and returns the appropriate thumbnail
 * url for displaying the photo at the given size.
 */
exports.thumbnailUrl = function(input, size) {
    if(!input || !input.id || !size) {
        return '/images/default-truck.jpg';
    }

    return thumbnailer.Thumbnailer.getAppropriateThumbnail(input, size);
};

/*
 * Custom swig tags
 */

var helpers = require('swig/lib/helpers');

/* Takes a truck and displays a thumbnail of it's profile photo
 * if one is set. If not, it displays a thumbnail of the default
 * truck photo.
 */
exports.truckThumbnail = function(indent, parser) {
    var truck = parser.parseVariable(this.args[0]),
        output = [];
    output.push(helpers.setVar('__truck', truck));
    output.push('_output += "hi";');
    return output.join('');
};
exports.truckThumbnail.ends = false;

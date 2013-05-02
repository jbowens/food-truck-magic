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
    console.log(truck);
    output.push(helpers.setVar('__truck', truck));
    /* TODO: Make this shit functional. */
    output.push('_output += __truck.name;');
    return output.join('');
};
exports.truckThumbnail.ends = false;

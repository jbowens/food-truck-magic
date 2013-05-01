/*
 * Custom swig filters
 */

/* Takes an array of strings and returns the strings concatenated
 * together and comma-delimited.
 */
exports.commasep = function(input) {
    if(!input || !(input instanceof Array)) {
        return input;
    }
    return input.join(', ');
};

/* 
 * The function we use for hashing passwords.
 */
var crypto = require('crypto');

exports.hash = function(password) {

    var shasum = crypto.createHash('sha1');
    
    // TODO: I think update and digest are technically deprecated
    // but I couldn't figure out how to use the alternatives.

    shasum.update(password);

    return shasum.digest('hex');

};

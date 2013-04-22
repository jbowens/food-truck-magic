/*
 * Security utilities n shit
 */
var hash = require('./hasher.js').hash;

/*
 * Generate a csrf token.
 */
exports.generateCsrfToken = function(request) {
    var seed = '#yolo#swag' + Math.random() + Date.now();
    var token = hash(seed);
    request.session.csrfToken = token;
    return token;
};

/* Compares the csrf token received from the user with the one
 * associated with the user's session. If they don't match, the
 * request should not performed.
 */
exports.csrfTokenMatches = function(request, receivedToken) {
    return receivedToken && receivedToken == request.session.csrfToken;
};

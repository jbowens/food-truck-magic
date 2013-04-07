/*
 * Displays a general purprose error page.
 */
var DEFAULT_ERROR_MSG = "An error occurred.";

/*
 * This function can be called by other routes to print an
 * error page with the given error message.
 */
exports.errorout = function(request, response, errmsg) {
    if( ! errmsg ) {
        errmsg = DEFAULT_ERROR_MSG;
    }
    response.render('error', {msg: errmsg});
};

exports.route = function(request, response) {
    /*
     * Error out with a generic error message.
     */
    exports.errorout(request, response, DEFAULT_ERROR_MSG);
};

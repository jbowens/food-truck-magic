/* The route that beings the twitter authorization process. This makes the initial
 * Twitter API call to request an access token that is necessary in order to
 * direct the user to Twitter for authorization. This is currently in use on:
 *
 * /setup/twitter
 *
 */
var twit = require('twit');
var fourohfour = require('../fourohfour.js').route;

exports.postRoute = function(request, response, data) {
    if(!(data.user && data.my_truck)) {
        fourohfour(request, response, data);
    } else if(!request.body.twitterName) {
        response.status(400);
        response.json({ err: true, errmsg: 'no twitter name' });
    } else {
        /* Shit looks good. Try to request an auth token. */
        /* TODO: Request an oauth token. */
        response.json({ err: false });
    }
};

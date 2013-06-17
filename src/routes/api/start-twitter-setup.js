/* The route that beings the twitter authorization process. This makes the initial
 * Twitter API call to request an access token that is necessary in order to
 * direct the user to Twitter for authorization. This is currently in use on:
 *
 * /setup/twitter
 *
 */
var Twit = require('twit');
var fourohfour = require('../fourohfour.js').route;

// TODO: Update the callback to be correct.
var TWITTER_OAUTH_TOKEN_CALLBACK = 'http://foodtruckler.com/api/access-token-response';

// TODO: Properly initialize the Twit object.
var twit = new Twit({});

exports.postRoute = function(request, response, data) {
    if(!(data.user && data.my_truck)) {
        fourohfour(request, response, data);
    } else if(!request.body.twitterName) {
        response.status(400);
        response.json({ err: true, errmsg: 'no twitter name' });
    } else {
        /* Shit looks good. Try to request an oauth token. */
        /* TODO: Save the twitter name. */
        var requestParams = {
            oauth_nonce: /* TODO: FILL ME IN! */null,
            oauth_callback: TWITTER_OAUTH_TOKEN_CALLBACK
        };
        twit.post('oauth/request_token', {}, function (err, reply) {
            if(err) {
                response.json({ err: true, errmsg: err.toString() });
            } else {
                console.log("recieved oauth_token ", reply.oauth_token);
                console.log("recieved oauth_token_secret ", reply.oauth_token_secret);
                response.json({ err: false });
            }
        });
    }
};

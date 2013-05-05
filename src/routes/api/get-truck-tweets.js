var twitterDb = require('../../twitterDb.js');

/*
 * Expects request.body to have the following parameters:
 * count: number of tweets to get 
 * truckid : id of truck to get tweets from
 */
exports.postRoute = function(request, response, data) {
    if (!('truckid' in request.body) || !('count' in request.body)) {
        data.error = true;
        response.json(data);
        return;
    }
    if (!parseInt(request.body.count, 10)) {
        data.error = true;
        response.json(data);
        return;
    }

    twitterDb.getMostRecent(request.body.truckid, parseInt(request.body.count, 10), function(err, tweets) {
        if (err) {
            data.error = true;
            response.json(data);
            return;
        }

        data.tweets = tweets;
        data.truckid = request.body.truckid;
        response.json(data);
    });
};

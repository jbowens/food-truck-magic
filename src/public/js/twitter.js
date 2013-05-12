/*
 * Twitter Client Side Parser
 *
 */

var foodTruckNS = foodTruckNS || {};
foodTruckNS.twitter = foodTruckNS.twitter || {};

foodTruckNS.twitter.parseTweet = function(tweet) {
    //TODO: parse tweets info
    return foodTruckNS.templates.tweet({ text: tweet.text });
};

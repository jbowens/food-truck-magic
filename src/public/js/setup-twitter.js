/* Client-side JS for the /setup/twitter handle used in 
 * new truck setup.
 */
var foodTruckNS = foodTruckNS || {};
foodTruckNS.setupTwitter = foodTruckNS.setupTwitter || {};

foodTruckNS.saveTwitterHandle = function(evt) {
    evt.preventDefault();
    var twitterHandle = $('#twitter-handle').val();
    alert(twitterHandle);
    // TODO: ajax up in hurr
};

$(document).ready(function(evt) {
    $('form#setup-twitter').submit(foodTruckNS.saveTwitterHandle);
});

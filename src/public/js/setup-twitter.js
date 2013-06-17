/* Client-side JS for the /setup/twitter handle used in 
 * new truck setup.
 */
var foodTruckNS = foodTruckNS || {};
foodTruckNS.setupTwitter = foodTruckNS.setupTwitter || {};

foodTruckNS.saveTwitterHandle = function(evt) {
    evt.preventDefault();
    var twitterHandle = $('#twitter-handle').val();
    $.post('/api/start-twitter-setup', {
        twitterName: twitterHandle
    }, function(xhr) {
        alert('yay!');    
    });
};

$(document).ready(function(evt) {
    $('form#setup-twitter').submit(foodTruckNS.saveTwitterHandle);
});

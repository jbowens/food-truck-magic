/*
 * Client-side javascript included everywhere.
 */
var foodTruckNS = foodTruckNS || {};

$(document).ready(function() {
    setTimeout(function() {
        $('.success-message').hide(1000);
    }, 2000);
});

foodTruckNS.displayError = function(message) {
    $('.error-message').text(message);
    $('.error-message').show();
    setTimeout(function() {
        $('.error-message').hide(1000);
    }, 4000);
};

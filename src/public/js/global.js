/*
 * Client-side javascript included everywhere.
 */
var foodTruckNS = foodTruckNS || {};

foodTruckNS.displayError = function(message) {
    $('.error-message').text(message);
    $('.error-message').show();
    setTimeout(function() {
        $('.error-message').animate({
            height: 0,
            opacity: 0
        }, 1000);
    }, 4000);
};

foodTruckNS.initGlobalListeners = function() {
    $('.fuploadSubmit').click(foodTruckNS.fileUploadSubmit);
};

foodTruckNS.fileUploadSubmit = function(evt) {
    var button = evt.target;
    $(button).val('Uploading...');
};

$(document).ready(function() {
    setTimeout(function() {
        $('.success-message').hide(1000);
    }, 2000);
    foodTruckNS.initGlobalListeners();

    //menu
    $('#menu-icon').click(function() {
        $('.header-container').toggleClass('header-expand');
    });
});

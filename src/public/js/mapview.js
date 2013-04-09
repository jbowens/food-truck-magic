/*
 * Client side javascript for displaying map of trucks
 */
$(function() {
    var foodTruckNS = foodTruckNS || {};
    foodTruckNS.mapview = foodTruckNS.mapview || {};

    foodTruckNS.mapview.initialize = function() {
        var mapOptions = {
            center: new google.maps.LatLng(41.82, -71.40),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    };

    google.maps.event.addDomListener(window, 'load', foodTruckNS.mapview.initialize);

});

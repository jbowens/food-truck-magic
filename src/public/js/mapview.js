/*
 * Client side javascript for displaying map of trucks
 */

var foodTruckNS = foodTruckNS || {};
foodTruckNS.mapview = foodTruckNS.mapview || {};

$(function() {
    foodTruckNS.mapview.initialize = function() {
        var mapOptions = {
            center: new google.maps.LatLng(41.82, -71.40),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

        /* add a test marker to the map */
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(41.82, -71.40),
            map: map,
            title: "Test"
        });

        /* add a test info window to the marker */
        var infowindow = new google.maps.InfoWindow({
            content: "<a href='/trucks/papa-jims'>Papa Jim's</a>"
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
        });
    };

    google.maps.event.addDomListener(window, 'load', foodTruckNS.mapview.initialize);

});

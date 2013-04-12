/*
 * Client side javascript for displaying map of trucks
 */

var foodTruckNS = foodTruckNS || {};
foodTruckNS.mapview = foodTruckNS.mapview || {};

foodTruckNS.mapview.initmap = function() {
    /* create the map. For now centered at a random location near the CIT */
    var mapOptions = {
        center: new google.maps.LatLng(41.82, -71.40),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    /* add markers onto the map */
    var geopoints = foodTruckNS.mapview.geopoints;
    for (var i = 0; i < geopoints.length; i++) {
        var geopoint = geopoints[i];

        /* parse the "POINT(xx.xx yy.yy)" string */
        var points = geopoint.point.split('(')[1];
        points = points.substring(0, points.length-1).split(' ');
        points[0] = parseFloat(points[0]);
        points[1] = parseFloat(points[1]);

        /* add marker to the map */
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(points[0], points[1]),
            map: map,
            title: geopoint.name
        });

        /* attach infowindow to the marker to link to the truck's page */
        var infowindow = new google.maps.InfoWindow({
            content: "<a href='/trucks/" + geopoint.urlid + "'>" + geopoint.name + "</a>"
        });

        foodTruckNS.mapview.attachClickHandler(marker, infowindow, map);
    }
};

foodTruckNS.mapview.attachClickHandler = function(marker, infowindow, map) {
    google.maps.event.addListener(marker, 'click', function() {

        if (foodTruckNS.mapview.activeWindow) {
            foodTruckNS.mapview.activeWindow.close();

            if (foodTruckNS.mapview.activeWindow == infowindow) {
                /* closing self */
                foodTruckNS.mapview.activeWindow = null;
            } else {
                /* closing some other window, opening self */
                infowindow.open(map, marker);
                foodTruckNS.mapview.activeWindow = infowindow;
            }
        } else {
            /* no active window right now. set self to be it */
            foodTruckNS.mapview.activeWindow = infowindow;
            infowindow.open(map, marker);
        }
    });
};

/*
 * Where geopoints is an array of objects { point : STRING, urlid: STRING }
 */
foodTruckNS.mapview.init = function(geopoints) {
    foodTruckNS.mapview.geopoints = geopoints;
    foodTruckNS.mapview.activeWindow = null;
    google.maps.event.addDomListener(window, 'load', foodTruckNS.mapview.initmap);
};

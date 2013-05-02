/*
 * Client side javascript for displaying map of trucks.
 * By itself, draws no markers on the map. Requires others
 * to call placeMarkers with a list of trucks.
 */

var foodTruckNS = foodTruckNS || {};
foodTruckNS.mapview = foodTruckNS.mapview || {};
var escapeHack = document.createElement('textarea');

foodTruckNS.mapview.closeActiveWindow = function() {
    if (foodTruckNS.mapview.activeWindow) {
        foodTruckNS.mapview.activeWindow.close();
        foodTruckNS.mapview.activeWindow = null;
    }
};


/*
 * Sets up the google map
 */
foodTruckNS.mapview.initmap = function() {
    /* create the map. For now centered at a random location near the CIT */
    var mapOptions = {
        center: foodTruckNS.mapview.defaultCenter,
        zoom: foodTruckNS.mapview.zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    /* make it so if a user clicks on the map, but not on
     * a marker, close whatever window is currently open */
    google.maps.event.addListener(map, 'click', function() {
        foodTruckNS.mapview.closeActiveWindow();
    });

    foodTruckNS.mapview.map = map;
};

/*
 * Given a list of open trucks, adds markers to the map for each 
 */
foodTruckNS.mapview.placeMarkers = function(trucks) {
    /* clear out old markers */
    for (var i = 0; i < foodTruckNS.mapview.markers.length; i++) {
        foodTruckNS.mapview.markers[i].setMap(null);
    }
    foodTruckNS.mapview.markers = [];

    /* add markers onto the map */
    var map = foodTruckNS.mapview.map;
    var totalLat = 0;
    var totalLon = 0;

    for (i = 0; i < trucks.length; i++) {
        var truck = trucks[i];

        /* parse the "POINT(xx.xx yy.yy)" string */
        var points = truck.geopoint.split('(')[1];
        points = points.substring(0, points.length-1).split(' ');
        points[0] = parseFloat(points[0]);
        points[1] = parseFloat(points[1]);

        /* add marker to the map */
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(points[0], points[1]),
            map: map,
            title: truck.name
        });

        if (!truck) {
            truck.description = "";
        }
        /* hack to escape potential html in the description */
        escapeHack.innerHTML = truck.description;
        truck.description = escapeHack.innerHTML;

        /* attach infowindow to the marker to link to the truck's page */
        var infowindow = new google.maps.InfoWindow({
            maxWidth: 230,
            content: "<a href='/trucks/" + truck.urlid + "'>" + truck.name + "</a>" + 
                     "<br/> <p style='word-break:break-word'>" + truck.description + "</p>" 
        });

        if (foodTruckNS.mapview.addInfoWindows) {
            foodTruckNS.mapview.attachClickHandler(marker, infowindow, map);
        }

        totalLat += points[0];
        totalLon += points[1];

        foodTruckNS.mapview.markers.push(marker);
    }

    /* set the center of the map to be the middle of all geopoints */
    if (trucks.length > 0) {
        totalLat = totalLat / trucks.length;
        totalLon = totalLon / trucks.length;
        map.setCenter(new google.maps.LatLng(totalLat, totalLon));
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
 * Takes in an an initData object, looking for the following keys:
 * zoomLevel: default zoom level for googel maps
 * addInfoWindows: (optional, default true) if true, attaches info windows to markers 
 */
foodTruckNS.mapview.init = function(initData) {
    foodTruckNS.mapview.zoom = 15;
    foodTruckNS.mapview.addInfoWindows = true;
    if (initData.zoomLevel) {
        foodTruckNS.mapview.zoom = initData.zoomLevel;
    }
    if (initData.addInfoWindows === false) {
        foodTruckNS.mapview.addInfoWindows = false;
    }

    /* initialize the map */
    foodTruckNS.mapview.markers = [];
    foodTruckNS.mapview.activeWindow = null;
    foodTruckNS.mapview.defaultCenter = new google.maps.LatLng(41.82, -71.40);
    foodTruckNS.mapview.initmap();

    /* On escape, close active marker window */
    $(document).keyup(function(e) {
        if (e.keyCode == 27) {
            foodTruckNS.mapview.closeActiveWindow();
        }
    });
};


/*
 * Queries just the truck given by truck id and draws it only
 */
foodTruckNS.mapview.showMyTruck = function(truckId) {
    $.ajax({
        type: 'POST',
        url: '/api/query-trucks',
        data: {
            open: true,
            truckid: truckId 
        },
        success: function(data) {
            if (!data.error)  {
                foodTruckNS.mapview.placeMarkers(data.trucks);
            }
        } 
    });
};


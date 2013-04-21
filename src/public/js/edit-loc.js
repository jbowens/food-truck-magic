/*
 * Client side js for the edit-truck page.
 */
var foodTruckNS = foodTruckNS || {};
foodTruckNS.editLoc = foodTruckNS.editLoc || {};

/* updates text on the open button */
foodTruckNS.editLoc.updateOpenButton = function($button) {
    if (foodTruckNS.editLoc.open) {
        $('#currently-closed-wrapper').hide();
        $('#currently-open-wrapper').show();
        $button.text("Stop tracking your truck's location");
    } else {
        $('#currently-closed-wrapper').show();
        $('#currently-open-wrapper').hide();
        $button.text("Track your truck's location");
    }
};

/* initializes the open button */
foodTruckNS.editLoc.setupOpenButton = function() {
    var $openButton = $('#open-button');

    foodTruckNS.editLoc.updateOpenButton($openButton);
    $openButton.show();

    var data = {
        setOpen: null,
        lon: 0,
        lat: 0
    };

    $openButton.click(function() {
        data.setOpen = !foodTruckNS.editLoc.open;
        if (!foodTruckNS.editLoc.open) {
            /* closed, now opening */
            if (!navigator.geolocation) {
                alert('geolocation is not supported with this browser. Cannot get location.');
                return;
            }
            navigator.geolocation.getCurrentPosition(function(pos) {
                data.lat = pos.coords.latitude;
                data.lon = pos.coords.longitude;
                foodTruckNS.editLoc.trackTruck(data, $openButton);
                foodTruckNS.editLoc.addressLookup(data.lat, data.lon);
            });
        } else { 
            /* open, now closing */
            data.lon = 0;
            data.lat = 0;
            foodTruckNS.editLoc.trackTruck(data, $openButton);
        }
    });
};

foodTruckNS.editLoc.trackTruck = function(data, $button) {
    $.ajax({
        type: 'POST',
        url: '/api/track-truck',
        data: data,
        success: function(data) {
            if (data.success) {
                foodTruckNS.editLoc.open = !foodTruckNS.editLoc.open;
                foodTruckNS.editLoc.updateOpenButton($button);
            } else {
                alert("Bad things happened trying to hit the track-truck endpoint");
            }
        }
    });
};

/*
 * Approximate the location of the truck based on it's geolocation
 */
foodTruckNS.editLoc.addressLookup = function(lat, lon) {
    $.ajax({
        type: 'GET',
        url: 'http://maps.googleapis.com/maps/api/geocode/json',
        data: {
            latlng: lat + ',' + lon,
            sensor: false
        },
        success: function(data) {
            if (data.results && data.results.length) {
            console.log(data.results[0].formatted_address);
            }
        }
    });
};

foodTruckNS.editLoc.init = function() {
    foodTruckNS.editLoc.setupOpenButton();
};

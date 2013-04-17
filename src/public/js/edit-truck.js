/*
 * Client side js for the edit-truck page.
 */
var foodTruckNS = foodTruckNS || {};
foodTruckNS.editTruck = foodTruckNS.editTruck || {};

/* updates text on the open button */
foodTruckNS.editTruck.updateOpenButton = function($button) {
    if (foodTruckNS.editTruck.open) {
        $button.text("Set truck's status to closed");
    } else {
        $button.text("Set truck's status to open");
    }
};

/* initializes the open button */
foodTruckNS.editTruck.setupOpenButton = function() {
    var $openButton = $('#open-button');

    foodTruckNS.editTruck.updateOpenButton($openButton);
    $openButton.show();

    var data = {
        setOpen: null,
        lon: 0,
        lat: 0
    };

    $openButton.click(function() {
        data.setOpen = !foodTruckNS.editTruck.open;
        if (!foodTruckNS.editTruck.open) {
            /* closed, now opening */
            if (!navigator.geolocation) {
                alert('geolocation is not supported with this browser. Cannot get location.');
                return;
            }
            navigator.geolocation.getCurrentPosition(function(pos) {
                data.lat = pos.coords.latitude;
                data.lon = pos.coords.longitude;
                foodTruckNS.editTruck.trackTruck(data, $openButton);
                foodTruckNS.editTruck.addressLookup(data.lat, data.lon);
            });
        } else { 
            /* open, now closing */
            data.lon = 0;
            data.lat = 0;
            foodTruckNS.editTruck.trackTruck(data, $openButton);
        }
    });
};

foodTruckNS.editTruck.trackTruck = function(data, $button) {
    $.ajax({
        type: 'POST',
        url: '/api/track-truck',
        data: data,
        success: function(data) {
            if (data.success) {
                foodTruckNS.editTruck.open = !foodTruckNS.editTruck.open;
                foodTruckNS.editTruck.updateOpenButton($button);
            } else {
                alert("Bad things happened trying to hit the track-truck endpoint");
            }
        }
    });
};

/*
 * Approximate the location of the truck based on it's geolocation
 */
foodTruckNS.editTruck.addressLookup = function(lat, lon) {
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

foodTruckNS.editTruck.init = function() {
    foodTruckNS.editTruck.setupOpenButton();
};

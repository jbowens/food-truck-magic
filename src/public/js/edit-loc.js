/*
 * Client side js for the edit-truck page.
 */
var foodTruckNS = foodTruckNS || {};
foodTruckNS.editLoc = foodTruckNS.editLoc || {};

/* updates text on the open button */
foodTruckNS.editLoc.updateOpenButton = function($button, curOpen) {
    if (foodTruckNS.editLoc.admin) {
        if (curOpen) {
            $button.text("Stop broadcasting this truck's location");
        } else {
            $button.text("Broadcast this truck's location for an hour");
        }
    } else {
        if (curOpen) {
            $('#currently-closed-wrapper').hide();
            $('#currently-open-wrapper').show();
            $button.text("Stop broadcasting your truck's location");
        } else {
            $('#currently-closed-wrapper').show();
            $('#currently-open-wrapper').hide();
            $button.text("Broadcast your truck's location");
        }
    }
};

/* initializes the open button */
foodTruckNS.editLoc.setupOpenButton = function(curOpen) {
    var $openButton = $('#open-button');
    var $hourSelect = $('#hour-select');
    var $minuteSelect = $('#minute-select');

    foodTruckNS.editLoc.updateOpenButton($openButton, curOpen);
    $openButton.show();

    var data = {
        setOpen: null,
        lon: 0,
        lat: 0,
        textLoc: '',
        openFor: 0,
        truckId: foodTruckNS.editLoc.truckId
    };

    $openButton.click(function() {
        data.setOpen = !curOpen;
        if (!curOpen) {
            /* closed, now opening */

            /* TODO: turn these alerts into nice error messages */
            if (!navigator.geolocation) {
                alert('geolocation is not supported with this browser. Cannot get location.');
                return;
            }

            $openButton.text("Getting truck location...");

            if ($hourSelect.val() == '0' && $minuteSelect.val() == '0') {
                alert('Provide a valid time to automatically close');
                return;
            }

            data.openFor = parseInt($hourSelect.val(), 10) * 60 * 60;
            data.openFor += parseInt($minuteSelect.val(), 10) * 60;
                 
            navigator.geolocation.getCurrentPosition(function(pos) {
                data.lat = pos.coords.latitude;
                data.lon = pos.coords.longitude;
                foodTruckNS.editLoc.trackTruck(data);
            }, function(error) {
                alert('error occurred trying to get geolocation data');
            }, {timeout: 10000});
        } else { 
            /* open, now closing */
            data.lon = 0;
            data.lat = 0;
            foodTruckNS.editLoc.trackTruck(data);
        }
    });
};

foodTruckNS.editLoc.trackTruck = function(data) {
    $.ajax({
        type: 'POST',
        url: '/api/track-truck',
        data: data,
        success: function(data) {
            if (data.success) {
                location.reload();
            } else {
                alert("Bad things happened trying to hit the track-truck endpoint");
            }
        }
    });
};

foodTruckNS.editLoc.init = function(curOpen, truckId) {
    foodTruckNS.editLoc.truckId = truckId;
    foodTruckNS.editLoc.setupOpenButton(curOpen);
};

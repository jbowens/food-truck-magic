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

    /* For now, when pressed and opening, request geolocation.
     * TODO: Probably gonna want to move this somewhere else later */
    if (navigator.geolocation) {
        $openButton.click(function() {
            navigator.geolocation.getCurrentPosition(function(pos) {
                var data = {
                    setOpen: !foodTruckNS.editTruck.open
                };

                /* if currently closed and now opening, get the location */
                if (!foodTruckNS.editTruck.open) {
                    data.lat = pos.coords.latitude;
                    data.lon = pos.coords.longitude;
                }
                $.ajax({
                    type: 'POST',
                    url: '/api/track-truck',
                    data: data,
                    success: function(data) {
                        foodTruckNS.editTruck.open = !foodTruckNS.editTruck.open;
                        foodTruckNS.editTruck.updateOpenButton($openButton);
                    }
                });
            });
        });
    } else {
        alert('uh oh. geolocation not supported with this browser');
    }
};

foodTruckNS.editTruck.init = function() {
    foodTruckNS.editTruck.setupOpenButton();
};

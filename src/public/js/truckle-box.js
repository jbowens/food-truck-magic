/*
 * Client side javascript for the truckle box. ;) 
 *
 * (spr-style naming conventions up in hurr)
 */

var foodTruckNS = foodTruckNS || {};
foodTruckNS.trucklebox = foodTruckNS.trucklebox || {};

/* The event listener for toggling the display of the truckle box.
 */
foodTruckNS.trucklebox.toggleTrucklebox = function(e) {
    e.preventDefault();
};

foodTruckNS.trucklebox.init = function() {
    if($("#truckle-box")) {
        /* Only initialize if the truckle box is on the page. */
        foodTruckNS.trucklebox.box = $("#truckle-box");
        $(foodTruckNS.trucklebox.box).click(foodTruckNS.trucklebox.toggleTrucklebox);
    }
};

$(document).ready(function(e) {
    foodTruckNS.trucklebox.init();
});

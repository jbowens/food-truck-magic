/*
 * Client side JS for truck page.
 */

var foodTruckNS = foodTruckNS || {};
foodTruckNS.truck = foodTruckNS.truck || { following: false};


var updateFollowButtonText = function($button) {
    if (foodTruckNS.truck.following) {
        $button.html("Stop following this truck");
    } else {
        $button.html("follow this truck!");
    }
};

var setupFollowButton = function() {
    /* get the trucks "urlid" */
    var truckUrl = window.location.href;
    truckUrl = truckUrl.substr(truckUrl.lastIndexOf('/') + 1);

    var $followButton = $('#follow');
    foodTruckNS.truck.following = ($('meta[name="following"]')[0].content === "true");
    updateFollowButtonText($followButton);
    $followButton.show();

    var truckId = $('meta[name="truckid"]')[0].content;

    $followButton.click(function() {
        $.ajax({
            type: 'POST',
            url: '/truck/' + truckId + '/follow-truck',
            data: {
                setFollow : !foodTruckNS.truck.following, 
                truckId : truckId
            },
            success: function(data) {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('yay');
                }
            }
        });
    });
};

$(function() {
    setupFollowButton();
});

/*
 * Client side JS for truck page.
 */

var foodTruckNS = foodTruckNS || {};
foodTruckNS.truck = foodTruckNS.truck || { following: false};

/*
 * Helper function to update the follow button's text
 */
foodTruckNS.truck.updateFollowButtonText = function($button) {
    if (foodTruckNS.truck.following) {
        $button.html("Stop following this truck");
    } else {
        $button.html("follow this truck!");
    }
};


/* 
 * setup click handler for the follow button
 */
foodTruckNS.truck.setupFollowButton = function() {
    var truckId = foodTruckNS.truck.truckid;
    var userId = foodTruckNS.truck.userid;

    var truckUrl = window.location.href;
    truckUrl = truckUrl.substr(truckUrl.lastIndexOf('/') + 1);

    var $followButton = $('#follow');
    foodTruckNS.truck.updateFollowButtonText($followButton);
    $followButton.show();

    /* setting up the click handler */
    $followButton.click(function() {
        $.ajax({
            type: 'POST',
            url: '/api/follow-truck',
            data: {
                setFollow: !foodTruckNS.truck.following, 
                truckId: truckId,
                userId: userId
            },
            success: function(data) {
                /* on success, update follow button and following state */
                foodTruckNS.truck.following = !foodTruckNS.truck.following;
                foodTruckNS.truck.updateFollowButtonText($followButton);
            }
        });
    });
};

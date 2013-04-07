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
 * setup click handlers for the follow button
 */
foodTruckNS.truck.setupFollowButton = function() {
    var truckUrl = window.location.href;
    truckUrl = truckUrl.substr(truckUrl.lastIndexOf('/') + 1);

    var $followButton = $('#follow');
    foodTruckNS.truck.following = ($('meta[name="following"]')[0].content == 'true');
    foodTruckNS.truck.updateFollowButtonText($followButton);
    $followButton.show();

    var truckId = $('meta[name="truckid"]')[0].content;
    var userId = $('meta[name="userid"]')[0].content;


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
                alert('Successfully followed/unfollowed');
                foodTruckNS.truck.following = !foodTruckNS.truck.following;
                foodTruckNS.truck.updateFollowButtonText($followButton);
            }
        });
    });
};

$(function() {
    if ($('#follow').length) {
        foodTruckNS.truck.setupFollowButton();
    }
});

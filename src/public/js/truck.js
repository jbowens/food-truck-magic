/*
 * Client side JS for truck page.
 */

var foodTruckNS = foodTruckNS || {};
foodTruckNS.truck = foodTruckNS.truck || { following: false};


/*
 * Helper function to update the follow button's text
 */
var updateFollowButtonText = function($button) {
    if (foodTruckNS.truck.following) {
        $button.html("Stop following this truck");
    } else {
        $button.html("follow this truck!");
    }
};


/* 
 * setup click handlers for the follow button
 */
var setupFollowButton = function() {
    var truckUrl = window.location.href;
    truckUrl = truckUrl.substr(truckUrl.lastIndexOf('/') + 1);

    var $followButton = $('#follow');
    foodTruckNS.truck.following = ($('meta[name="following"]')[0].content == 'true');
    updateFollowButtonText($followButton);
    $followButton.show();

    var truckId = $('meta[name="truckid"]')[0].content;

    /* setting up the click handler */
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
                    alert("Uh oh: " + data.error);
                } else {
                    /* on success, update follow button and following state */
                    alert('Successfully followed/unfollowed');
                    foodTruckNS.truck.following = !foodTruckNS.truck.following;
                    updateFollowButtonText($followButton);
                }
            }
        });
    });
};

$(function() {
    setupFollowButton();
});

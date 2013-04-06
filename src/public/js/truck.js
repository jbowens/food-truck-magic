/*
 * Client side JS for truck page.
 */

var setupFollowButton = function() {

    /* get the trucks "urlid" */
    var truckId = window.location.href;
    truckId = truckId.substr(truckId.lastIndexOf('/') + 1);

    var $followButton = $('#follow');
    $followButton.click(function() {
        $.ajax({
            type: 'POST',
            url: '/truck/' + truckId + '/follow-truck',
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

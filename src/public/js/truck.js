/*
 * Client side JS for truck page.
 */

var foodTruckNS = foodTruckNS || {};
foodTruckNS.truck = foodTruckNS.truck || { favoriting: false};

/*
 * Helper function to update the favorite button's text
 */
foodTruckNS.truck.updateFavoriteButtonText = function($button) {
    if (foodTruckNS.truck.favoriting) {
        $button.toggleClass('unfollow');
        $button.html('<span id="favorite-button" class="iconic iconic-pin unfollow"></span> Unfollow');
    } else {
        $button.removeClass('unfollow');
        $button.html('<span id="favorite-button" class="iconic iconic-pin follow"></span> Follow!');
    }
};


/* 
 * setup click handler for the favorite button
 */
foodTruckNS.truck.setupFavoriteButton = function() {
    var truckId = foodTruckNS.truck.truckid;
    var userId = foodTruckNS.truck.userid;

    var truckUrl = window.location.href;
    truckUrl = truckUrl.substr(truckUrl.lastIndexOf('/') + 1);

    var $favoriteButton = $('#favorite');
    foodTruckNS.truck.updateFavoriteButtonText($favoriteButton);
    $favoriteButton.show();

    /* setting up the click handler */
    $favoriteButton.click(function() {
        $.ajax({
            type: 'POST',
            url: '/api/follow-truck',
            data: {
                setFollow: !foodTruckNS.truck.favoriting, 
                truckId: truckId,
                userId: userId
            },
            success: function(data) {
                /* on success, update favorite button and favoriting state */
                if (data.success) {
                    foodTruckNS.truck.favoriting = !foodTruckNS.truck.favoriting;
                    foodTruckNS.truck.updateFavoriteButtonText($favoriteButton);
                }
            }
        });
    });
};

foodTruckNS.truck.setupTweetList = function() {
    /* tweet-list will only be present if the truck has a twitterid */
    var $tweetList = $('#tweet-list');
    if ($tweetList.length) {
        foodTruckNS.truck.updateTweetList();
        setInterval(foodTruckNS.truck.updateTweetList, 15000);
    }
};

foodTruckNS.truck.updateTweetList = function() {
    var $tweetList = $('#tweet-list');
    $.ajax({
        type: 'POST',
        url: '/api/get-truck-tweets',
        data: {
            truckid: foodTruckNS.truck.truckid,
            count: 5
        },
        success: function(data) {
            if (!data.error) {
                var innerHtml = '<ul>';
                var tweets = data.tweets;
                for (var i = 0; i < tweets.length; i++) {
                    innerHtml += '<li>' + tweets[i].text + '</li>';
                }

                innerHtml += '</ul>';
                $tweetList.html(innerHtml);
                foodTruckNS.linker.linkify($tweetList[0]);
            }
        }
    });
};

/*
 * Client side JS for the edit-account/favorites page
 */
var foodTruckNS = foodTruckNS || {};
foodTruckNS.favorites = foodTruckNS.favorites || {};

foodTruckNS.favorites.listFavorites = function(trucks) {
    var $favoritesContainer = $('#favorites-container');
    
    if (trucks.length === 0) {
        $favoritesContainer.html('You are not favoriting any trucks.');
    } else {
        var innerHtml = '<ul>';
        for (var i = 0; i < trucks.length; i++) {
            var truck = trucks[i];
            innerHtml += ''  +
                '<li>' +
                '   <button id="unfavorite' + i + '"> Stop favoriting </button>' +
                '   <a href="/trucks/' + truck.urlid + '">' +truck.name + '</a>' +
                '</li>';
        }

        innerHtml += '</ul>';
        $favoritesContainer.html(innerHtml);

        /* apply click handlers */
        for (i = 0; i < trucks.length; i++) {
            var $button = $('#unfavorite' + i);
            $button.click(foodTruckNS.favorites.clickHandler(trucks[i]));
        }
    }
};

foodTruckNS.favorites.clickHandler = function(truck) { 
    return function() {
        $.ajax({
            type: 'POST',
            url: '/api/follow-truck',
            data: {
                setFollow: false,
                truckId: truck.id,
                userId: foodTruckNS.userId
            },
            success: function(data) {
                if (data.success) {
                    location.reload();
                }
            }
        });
    };
};

foodTruckNS.favorites.getFavorites = function() {
    $.ajax({
        type: 'GET',
        url: '/api/get-favorites/' + foodTruckNS.userId,
        success: function(data) {
            if (data.error)  {
                foodTruckNS.displayError("Couldn't load favorites");
            } else {
                foodTruckNS.favorites.listFavorites(data.trucks);
            }
        }
    });
};

foodTruckNS.favorites.init = function() {
    foodTruckNS.favorites.getFavorites();
};

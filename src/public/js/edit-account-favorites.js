/*
 * Client side JS for the edit-account/favorites page
 */
var foodTruckNS = foodTruckNS || {};
foodTruckNS.favorites = foodTruckNS.favorites || {};

foodTruckNS.favorites.listFavorites = function(trucks) {
    var $favoritesContainer = $('#favorites-container');
    var innerHtml = '<ul>';
    for (var i = 0; i < trucks.length; i++) {
        var truck = trucks[i];
        innerHtml += ''  +
            '<li>' +
            '   <a href="/trucks/' + truck.urlid + '">' +
            '       <h3 class="truck-name">' + truck.name + '</h3' +
            '   </a>' +
            '</li>';
    }

    innerHtml += '</ul>';

    $favoritesContainer.html(innerHtml);
};

foodTruckNS.favorites.getFavorites = function() {
    $.ajax({
        type: 'GET',
        url: '/api/get-favorites/' + foodTruckNS.favorites.userId,
        success: function(data) {
            if (data.error)  {
                foodTruckNS.displayError("Couldn't load favorites");
            } else {
                foodTruckNS.favorites.listFavorites(data.trucks);
            }
        }
    });
};

foodTruckNS.favorites.init = function(userId) {
    foodTruckNS.favorites.userId = userId;
    foodTruckNS.favorites.getFavorites();
};

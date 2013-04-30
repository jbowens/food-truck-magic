/*
 * Client side javascript for hitting the query-trucks api
 */

var foodTruckNS = foodTruckNS || {};
foodTruckNS.query = foodTruckNS.query || {};

foodTruckNS.query.innerLiHTML = function(urlid, name, description, thumbnailLink, thumbnailSize) {
    var innerLi = '' +
        '<li>' +
            '<a class="truck-image" href="trucks/' + urlid + '">' +
            '   <img class="truck-thumbnail"' +
            '       src="' + thumbnailLink + '"' +
            '       alt="' + name + '"' +
            '       width="' + thumbnailSize + '" height="' + thumbnailSize + '" />' +
            '</a>' +
            '<div class="truck-info">' +
            '   <a href="trucks/' + urlid + '">' +
            '       <h3 class="truck-name">' + name + '</h3' +
            '   </a>' +
            '   <p>' + description + '</p>' +
            '</div>' +
        '</li>';
    
    return innerLi;
};

/*
 * Appends list of trucks to the truckContainer
 */
foodTruckNS.query.listTrucks = function(trucks, thumbnailSize) {
    var container = foodTruckNS.query.truckContainer;
    var containerHTML = '';

    for (var i = 0; i < trucks.length; i++) {
        var truck = trucks[i];
        var thumbnailLink = "/images/default-truck.jpg";
        var truckDescription = "";
        if (truck.uploadid) {
            thumbnailLink = truck.thumb;
        }
        if (truck.description) {
            truckDescription = truck.description;
        }

        containerHTML += foodTruckNS.query.innerLiHTML(truck.urlid, truck.name, truckDescription, thumbnailLink, thumbnailSize);
    }

    container.html(containerHTML);
};

/*
 * Hits API endpoint to get truck data
 */
foodTruckNS.query.getTrucks = function(args) {
    foodTruckNS.query.truckContainer.hide();
    foodTruckNS.query.truckContainer.fadeIn("slow");
    $.ajax({
        type: 'POST',
        url: '/api/query-trucks',
        data: args,
        success: function(data) {
            if (data.error)  {
                foodTruckNS.query.truckContainer.html("Couldn't load trucks :(");
            } else {
                foodTruckNS.query.listTrucks(data.trucks, data.thumbnailSize);
            }
        } 
    });
};

/*
 * Just a proof of concept to see if searching trucks works
 */
foodTruckNS.query.setupSearch = function() {
    var $searchBar = $('#truck-search');
    var $searchButton = $('#truck-search-button');

    $searchBar.keyup(function(e) {
        if (e.keyCode == 13) {
            foodTruckNS.query.processFilters();
        }
    });

    $searchButton.click(function() {
        foodTruckNS.query.processFilters();
    });
};


/*
 * Handler for when search button is pressed.
 * Checks which filters are active and sends them to
 * getTrucks.
 */
foodTruckNS.query.processFilters = function() {
    var $searchBar = $('#truck-search');
    var $favorites = $('#favorites-filter');
    var $near = $('#near-filter');
    var $open = $('#open-filter');

    var args = {};
    args.name = $searchBar.val();
    if ($open.hasClass('active')) {
        args.open = true;
    }

    if($near.hasClass('active')) {
        if (!navigator.geolocation) {
            foodTruckNS.displayError('Geolocation is not supported with this browser. Cannot get location.');
            return;
        }
        navigator.geolocation.getCurrentPosition(function(pos) {
            args.range = {};
            args.range.lat = pos.coords.latitude;
            args.range.lon = pos.coords.longitude;
            args.range.distance = 50;
            foodTruckNS.query.getTrucks(args);
        }, function(error) {
            foodTruckNS.displayError('Error occurred trying to get geolocation data. Please reload the page and try again');
        }, {timeout: 8000});
    } else {
        foodTruckNS.query.getTrucks(args);
    }
};


/*
 * Setup click handlers for the search filters
 */
foodTruckNS.query.setupFilters = function() {
    var $favorites = $('#favorites-filter');
    var $near = $('#near-filter');
    var $open = $('#open-filter');

    $favorites.click(function() {
        $favorites.toggleClass('active');
    });
    $near.click(function() {
        $near.toggleClass('active');
    });
    $open.click(function() {
        $open.toggleClass('active');
    });
};


foodTruckNS.query.init = function(truckContainer) {
    foodTruckNS.query.truckContainer = truckContainer; 
    foodTruckNS.query.getTrucks({});
    foodTruckNS.query.setupFilters();
    foodTruckNS.query.setupSearch();
};

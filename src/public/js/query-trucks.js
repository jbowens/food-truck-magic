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
            foodTruckNS.query.getTrucks({
                name: $searchBar.val()
            });
        }
    });

    $searchButton.click(function() {
        foodTruckNS.query.getTrucks({
            name: $searchBar.val()
        });
    });
};

foodTruckNS.query.init = function(truckContainer) {
    foodTruckNS.query.truckContainer = truckContainer; 
    foodTruckNS.query.getTrucks({});
    foodTruckNS.query.setupSearch();
};

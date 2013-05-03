/* Client-side js for the edit-truck/info page. Namely this
 * js handles all the category elements and saving of categories
 * through an ajax call.
 */

var foodTruckNS = foodTruckNS || {};
foodTruckNS.editTruckInfo = foodTruckNS.editTruckInfo || {};

/* Maximum allowed number of categories per truck. */
var CATEGORY_CAP = 3;

/* Reconstructs the category select based on the given list of
 * category objects.
 */
foodTruckNS.editTruckInfo.reconstructCategories = function(cats) {
    cats.sort(function(a, b) {
        if(a.name > b.name) {
            return 1;
        } else if (b.name > a.name) {
            return -1;
        } else {
            return 0;
        }
    });
    var select = $('#add-category');
    $(select).empty();
    for(var i = 0; i < cats.length; i++) {
        var option = $('<option />');
        $(option).val(cats[i].id);
        $(option).text(cats[i].name);
        $(select).append(option);
    }
};

/* Gets the categories from the given select box.
 */
foodTruckNS.editTruckInfo.getCategories = function(select) {
    var cats = [];
    $(select).find('option').each(function() {
        var cat = {};
        cat.name = $(this).text();
        cat.id = $(this).val();
        cats.push(cat);
    });
    return cats;
};

foodTruckNS.editTruckInfo.unselectCat = function(select, li) {
    var currentCats = foodTruckNS.editTruckInfo.getCategories(select);
    var catToReAdd = {};
    catToReAdd.name = $(li).find('.cat-name').text();
    catToReAdd.id = $(li).attr('data-catid');
    currentCats.push(catToReAdd);
    foodTruckNS.editTruckInfo.reconstructCategories(currentCats);
    $(li).remove();
    $('#saveCategory').removeAttr('disabled');
};

$(document).ready(function() {
    $('#saveCategory').click(function(e) {
        try {
            e.preventDefault();
            var select = $('#add-category');
            if(!$(select).find('option').length) {
                /* There are no options left in the select box. */
                return;
            }
            if($('.current-categories li').length >= CATEGORY_CAP) {
                foodTruckNS.displayError('Sorry, trucks may only classify themselves as up to three categories.');
                return;
            }
            var catid = $(select).val();
            var catname = $(select).find('option:selected').text();
            $(select).find('option:selected').remove();
            var span = $('<span />');
            $(span).addClass('remove-cat');
            $(span).text('x');
            var li = $('<li />');
            var catnameel = $('<span />');
            $(catnameel).addClass('cat-name');
            catnameel.text(catname);
            $(li).append(catnameel);
            $(li).append(span);
            $(li).attr('data-catid', catid);

            $(span).click(function(e2) {
                e2.preventDefault();
                foodTruckNS.editTruckInfo.unselectCat(select, li);
            });

            $('.current-categories').append(li);
            if($('.current-categories li').length >= CATEGORY_CAP) {
                $('#saveCategory').attr('disabled', 'disabled');
            }
        } catch(err) {
            console.error(err);
        }
    });
    $('#edit-truck-details #fake-submit').click(function(e) {
        e.preventDefault();
        var data = {'cats': []};
        $('.current-categories li').each(function() {
            data.cats.push(parseInt($(this).attr('data-catid'), 10));
        });
        console.log(data);
        $.post('/api/save-categories', data, function(resp) {
            /* Once we've saved the categories, save the rest of the form. */
            /* JANK */
            $('#edit-truck-details').submit();
        });
    });
    $('.remove-cat').click(function(e) {
        e.preventDefault();
        foodTruckNS.editTruckInfo.unselectCat($('#add-category'), $(e.target).closest('li')); 
    });
});

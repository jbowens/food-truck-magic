function reconstructCategories(cats) {
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
}

function getCategories(select) {
    var cats = [];
    $(select).find('option').each(function() {
        var cat = {};
        cat.name = $(this).text();
        cat.id = $(this).val();
        cats.push(cat);
    });
    return cats;
}


$(document).ready(function() {
    $('#saveCategory').click(function(e) {
        try {
            e.preventDefault();
            var select = $('#add-category');
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
                var currentCats = getCategories(select);
                var catToReAdd = {};
                catToReAdd.name = $(li).find('.cat-name').text();
                catToReAdd.id = $(li).attr('data-catid');
                currentCats.push(catToReAdd);
                reconstructCategories(currentCats);
                $(li).remove();
            });

            $('.current-categories').append(li);
        } catch(err) {
            console.error(err);
        }
    });
});

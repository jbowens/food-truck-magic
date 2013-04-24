$(document).ready(function() {
    $('#saveCategory').click(function(e) {
        e.preventDefault();
        var select = $('#add-category');
        var catid = $(select).val();
        var catname = $(select).find('option:selected').text();
        $(select).find('option:selected').remove();
        var li = $('<li />');
        $(li).text(catname);
        $('.current-categories').append(li);
    });
});

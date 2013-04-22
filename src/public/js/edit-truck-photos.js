$(document).ready(function() {
    $('.delete-photo').click(function(e) {
        e.preventDefault();
        var photo = $(e.target).closest('.photo');
        /* TODO: Send an ajax call to delete that fucker. */
        photo.remove();
    });
});

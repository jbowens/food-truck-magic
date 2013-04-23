$(document).ready(function() {
    $('.delete-photo').click(function(e) {
        e.preventDefault();
        var photo = $(e.target).closest('.photo');
        var photoid = $(photo).attr('data-photoid');
        /* Send an ajax call to delete that fucker. */
        $.post('/api/delete-photo', {
            csrfToken: window.csrf,
            uploadid: photoid
        }, function(data) {
            if(!data || !data.success) {
                alert('Unable to delete the photo. Are you still logged in?');
            } else {
                photo.remove();
            }
        }, 'json');
    });
});

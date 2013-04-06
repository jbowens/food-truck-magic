/*
 * Client side JS for /sign-up page.
 */

var usernameValidityCache = {};

/* Hides or shows the username error depending on the current
 * username and its value in the username validity cache.
 */
function updateUsernameError() {
    var username = $('#signup_username').val();
    if( ! username || ! usernameValidityCache.hasOwnProperty(username) ) {
        /* It's possible that the user has changed the field and we
           no longer know the validity of the error. */
        $("#username-error").hide();
    } else {
        var taken = usernameValidityCache[username];
        if(taken) {
            console.log(username, 'is taken');
            if($("#username-error").length) {
                $("#username-error").show();
            } else {
                var errordiv = $('<div class="error" id="username-error">The username \'<span class="username"></span>\' is already taken.</div>');
                errordiv.find(".username").text(username);
                $(".username-form-item").append(errordiv);
            }
        } else {
            $("#username-error").hide();
        }
    }
}

/* Begins the process of validating the username, including making an ajax
 * call to check if the username is taken, if necessary. 
 */
function validateUsername(evt) {

    var username = $('#signup_username').val();

    if( username && ! usernameValidityCache.hasOwnProperty(username) ) {
        $.getJSON('/api/check-username/'+encodeURIComponent(username), function(res) {
            console.log(res);
            if(res) {
                usernameValidityCache[username] = res.username_exists;
                updateUsernameError();
            }
        });
    } else {
        updateUsernameError();
    }

}

$(document).ready(function(e) {

    /* TODO: Setup listeners */
    $('#signup_username').change(validateUsername);
    $('#signup_username').keyup(validateUsername);

});

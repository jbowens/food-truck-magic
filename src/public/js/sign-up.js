/*
 * Client side JS for /sign-up page.
 */
var foodTruckNS = foodTruckNS || {};
foodTruckNS.signup = foodTruckNS.signup || {usernameValidityCache: {}};

/* Hides or shows the username error depending on the current
 * username and its value in the username validity cache.
 */
foodTruckNS.signup.updateUsernameError = function() {
    var username = $('#signup_username').val();
    if( ! username || ! foodTruckNS.signup.usernameValidityCache.hasOwnProperty(username) ) {
        /* It's possible that the user has changed the field and we
           no longer know the validity of the error. */
        $("#username-error").hide();
    } else {
        var taken = foodTruckNS.signup.usernameValidityCache[username];
        if(taken) {
            if($("#username-error").length) {
                $("#username-error .username").text(username);
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
};

/* Begins the process of validating the username, including making an ajax
 * call to check if the username is taken, if necessary. 
 */
foodTruckNS.signup.validateUsername = function(evt) {

    var username = $('#signup_username').val();

    if( username && ! foodTruckNS.signup.usernameValidityCache.hasOwnProperty(username) ) {
        $.getJSON('/api/check-username/'+encodeURIComponent(username), function(res) {
            console.log(res);
            if(res) {
                foodTruckNS.signup.usernameValidityCache[username] = res.username_exists;
                foodTruckNS.signup.updateUsernameError();
            }
        });
    } else {
        foodTruckNS.signup.updateUsernameError();
    }

};

$(document).ready(function(e) {

    $('#signup_username').change(foodTruckNS.signup.validateUsername);
    $('#signup_username').keyup(foodTruckNS.signup.validateUsername);

});

/*
 * Client side JS for /sign-up page.
 */
var foodTruckNS = foodTruckNS || {};
foodTruckNS.signup = foodTruckNS.signup || {usernameValidityCache: {}};

/* Hides or shows the username error depending on the current
 * username and its value in the username validity cache.
 */
foodTruckNS.signup.updateUsernameError = function(el) {
    var username = $(el).val();
    var form = $(el).closest('form');
    if( ! username || ! foodTruckNS.signup.usernameValidityCache.hasOwnProperty(username) ) {
        /* It's possible that the user has changed the field and we
           no longer know the validity of the error. */
        form.find('.username-error').hide();
    } else {
        var taken = foodTruckNS.signup.usernameValidityCache[username];
        if(taken) {
            if(form.find('.username-error').length) {
                form.find(".username-error .username").text(username);
                form.find(".username-error").show();
            } else {
                var errordiv = $('<div class="error username-error">The username \'<span class="username"></span>\' is already taken.</div>');
                errordiv.find(".username").text(username);
                form.find(".username-form-item").append(errordiv);
            }
        } else {
            form.find(".username-error").hide();
        }
    }
};

/* Begins the process of validating the username, including making an ajax
 * call to check if the username is taken, if necessary. 
 */
foodTruckNS.signup.validateUsername = function(evt) {

    var username = $(evt.target).val();

    if( username && ! foodTruckNS.signup.usernameValidityCache.hasOwnProperty(username) ) {
        $.getJSON('/api/check-username/'+encodeURIComponent(username), function(res) {
            console.log(res);
            if(res) {
                foodTruckNS.signup.usernameValidityCache[username] = res.username_exists;
                foodTruckNS.signup.updateUsernameError(evt.target);
            }
        });
    } else {
        foodTruckNS.signup.updateUsernameError(evt.target);
    }

};

$(document).ready(function() {

    $('.signup_username').change(foodTruckNS.signup.validateUsername);
    $('.signup_username').keyup(foodTruckNS.signup.validateUsername);

});

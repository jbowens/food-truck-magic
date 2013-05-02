var db = require('../../db.js').Database;
var bailout = require('../fatalerror.js').bailout;
var fourohfour = require('../fourohfour.js').route;
var hash = require('../../hasher.js').hash;
var getUser = require('../login.js').getUser;

var SQL_UPDATE_PASS = 'UPDATE users SET pass = $1 WHERE name = $2;';


function renderPage(response, data) {
    response.render('edit-account-password', data);
}

exports.route = function(request, response, data) {
    if (!request.session.user) {
        data.badUserRoute = true;
        return fourohfour(request, response, data);
    }

    renderPage(response, data);
};

exports.postRoute = function(request, response, data) {
    var err = false;

    if (!request.session.user) {
        data.badUserRoute = true;
        return fourohfour(request, response, data);
    }

    if(!request.body.oldPassword) {
        err = true; 
        data.badOld = true;
    }
    if (!request.body.newPassword) {
        err = true;
        data.noNew = true;
    }
    if (!request.body.confirmPassword ||
            request.body.newPassword != request.body.confirmPassword) {
        err = true;
        data.badConfirm = true;
    }

    if (err) {
        return renderPage(response, data);
    }

    /* check if old password is correct */
    getUser(request.session.user.name, request.body.oldPassword, function(err, user) {
        if(!user) {
            data.badOld = true;
            return renderPage(response, data);
        }

        /* update password */
        var hashedPassword = hash(request.body.newPassword);
        db.query(SQL_UPDATE_PASS, [hashedPassword, request.session.user.name], function(err, res) {
            if(err) { 
                console.error(err); 
                return bailout(request, response, data, err);
            }

            data.changesSaved = true;
            return renderPage(response, data);
        });
    });
};

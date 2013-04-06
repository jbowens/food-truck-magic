var _ = require('underscore');
var db = require('../db.js').Database;
var bailout = require('./fatalerror.js').bailout;

var SQL_GET_FOLLOWS = 'SELECT * FROM follows WHERE userid=$1';

var defaultTemplateData = {
    user: null,
    following: null
};


exports.route = function(request, response) {
    var data = _.clone(defaultTemplateData);
    function renderPage() {
        response.render('index', data);
    }


    if (request.session.user) {
        data.user = request.session.user;

        /* let's get the list of following trucks */
        db.get(function(err, conn) {
            if(err) {
                bailout(request, response, err);
            }

            conn.query(SQL_GET_FOLLOWS, [request.session.user.id], function(err, res) {
                db.release(conn);
                if (err) {
                    renderPage();
                }

                if (res && res.rows) {
                    data.following = res.rows;
                }
                renderPage();
            });
        });
    } else {
        /* not logged in */
        renderPage();
    }
};

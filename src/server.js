/*
 * Food trucks, brah.
 */
"use strict";

var express = require('express');
var engine = require('ejs-locals');
var lessMiddleware = require('less-middleware');

var db = require('./db.js').Database;
var config = require('./config.js').Config;
var routes = require('./routes.js');

var app = express();

var port = 8080;


/* Configuration options for express */
app.configure(function() {
    app.engine('ejs', engine);      // use ejs-locals for ejs templates
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    app.use(lessMiddleware({        // compile less dynamically into css
        src: __dirname +'/public',
        compress: false,
        debug: true
    }));
    app.use(express.static(__dirname +'/public'));
});


config.init(function() {
    db.init();

    app.listen(port, function() {
        db.get(function(err, conn) {
            console.log('got a db connection!!!!!');
            var sql = 'SELECT * from users';
            conn.query(sql).on('row', function(row) {
                console.log(row);
            }).on('end', function() {
                db.release(conn);
            });
        });

        routes.setupRoutes(app);
        console.log('- Server listening on port ' + port);
    });
});


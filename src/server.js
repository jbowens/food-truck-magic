/*
 * Food trucks, brah.
 */
"use strict";

var express = require('express');
var db = require('./db.js').Database;
var config = require('./config.js').Config;

var app = express();

var port = 8080;

config.init(function() {
    app.use('/public', express.static(__dirname + '/public'));

    db.init();

    app.listen(port, function () {
        db.get(function(err, conn) {
            console.log('got a db connection!!!!!');
            db.release(conn);
        });
        console.log('- Server listening on port ' + port);
    });
});

/*
 * Food trucks, brah.
 */
"use strict";

var express = require('express');
var engine = require('ejs-locals');
var args = require('optimist').argv;

var db = require('./db.js').Database;
var config = require('./config.js').Config;
var routes = require('./routes.js');

var app = express();

var port = args.port ? args.port : 8080;

/* Configuration options for express */
app.configure(function() {
    app.use(express.bodyParser());
    app.engine('ejs', engine);      // use ejs-locals for ejs templates
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    app.use(express.static(__dirname +'/public'));
});


config.init(function() {
    db.init();

    app.listen(port, function() {
        routes.setupRoutes(app);
        console.log('- Server listening on port ' + port);
    });
});


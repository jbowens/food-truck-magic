/*
 * Food trucks, brah.
 */
"use strict";

var SESSION_SECRET_KEY = 'ft_session';

var express = require('express');
var cons = require('consolidate');
var fs = require('fs');
var swig = require('swig');
var args = require('optimist').argv;

var db = require('./db.js').Database;
var config = require('./config.js').Config;
var thumbnailSizes = require('./thumbnailer.js').thumbnailSizes;
var routes = require('./routes.js');
var cron = require('./cron.js');

var app = express();

var port = args.port || 8080;

/* Configuration options for express */
app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: SESSION_SECRET_KEY,
        store: new express.session.MemoryStore({reapInterval: 30000})
    }));

    app.engine('.html', cons.swig);
    app.set('view engine', 'html');
    swig.init({
        root: __dirname + '/views/',
        allowErrors : true,
        filters: require('./custom-filters.js')
    });
    app.set('views', __dirname + '/views/');
    app.use(express.static(__dirname +'/public'));
    app.use('/uploads', express.static(__dirname +'/../uploads'));
});


config.init(function() {
    
    /* Setup directories */
    var uploadsDir = __dirname + '/../uploads/';
    for(var i = 0; i < thumbnailSizes.length; i++) {
        try {
            fs.mkdirSync(uploadsDir + thumbnailSizes[i].name);
        } catch(err) {}
    }

    db.init();

    /* run cronjobs */
    cron.startCronJobs();

    app.listen(port, function() {
        routes.setupRoutes(app);
        console.log('- Server listening on port ' + port);
    });
});


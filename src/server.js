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
exports.app = app;

/* Configuration options for express */
app.configure(function() {
    app.set('port', process.env.PORT_FOODLER || 8080);
    app.set('port_twitter', process.env.PORT_TWITTER || 8081);
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
        filters: require('./custom-filters.js'),
        extensions: {
            thumbnailer: require('./thumbnailer.js'),
            truckstore: require('./truckstore.js')
        },
        tags: require('./custom-tags.js')
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

    app.listen(app.get('port'), function() {
        routes.setupRoutes(app);
        console.log('- Server listening on port ' + app.get('port'));
    });
});


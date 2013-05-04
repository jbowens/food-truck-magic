/*
 * The route for the main truck page.
 */
var _ = require('underscore');
var db = require('../db.js').Database;
var truckStore = require('../truckstore.js').TruckStore;
var categories = require('../categories.js');
var thumbnailer = require('../thumbnailer.js').Thumbnailer;
var fourOhFourRoute = require('./fourohfour.js').route;
var uploader = require('../file-uploader.js');

/* Constants */
var PROF_PIC_SIZE = 240;
var PHOTO_THUMB_SIZE = 100;

/* SQL Queries */
var SQL_GET_TRUCK_BY_IDENTIFIER = "SELECT * FROM trucks WHERE urlid = $1 LIMIT 1";
var SQL_GET_FOLLOWS = "SELECT * FROM FOLLOWS WHERE userid = $1 AND truckid = $2";

function populateWithMenu(truck, callback) {
    if(!truck.menuuploadid) {
        callback();
    } else {
        uploader.getUpload(truck.menuuploadid, function(err, uploadData) {
            if(err) {
                console.error(err);
            } else {
                truck.menu = uploadData;
            }

            callback();
        });
    }
}

exports.route = function(request, response, data) {
    data.following = false;
    data.profPicSize = PROF_PIC_SIZE;
    data.photoThumbSize = PHOTO_THUMB_SIZE;

    var truckurlid = request.params.truckidentifier;

    /* Get the truck from the database! */
    db.query(SQL_GET_TRUCK_BY_IDENTIFIER, [truckurlid], function(err, res) {
       
        if(err || !res.rows.length) {
            if(err) {
                console.error(err);
            }
            /* If the truck doesn't exist or something fucked up, treat it as a 404. */
            return fourOhFourRoute(request, response, data);
        }
       
        data.truck = res.rows[0];
        displayTruck(request, response, data);
   });
};

function displayTruck(request, response, data) {
    
    populateWithMenu(data.truck, function() {
        categories.getTrucksCategories(data.truck.id, function(err, truck_cats) {
            if(err) {
                console.error(err);
                data.truck_cats = [];
            } else {
                data.truck_cats = truck_cats;
                data.truck_cats_names = _.map(truck_cats, function(x) { return x.name; });
            }
            truckStore.getPhotos(data.truck.id, function(err, res) {
                data.photos = err ? [] : res;

                /* Find the prof pic */
                if(data.truck.photouploadid) {
                    for(var i = 0; i < data.photos.length; i++) {
                        if(data.photos[i].id == data.truck.photouploadid) {
                            data.profPic = data.photos[i];
                            data.profPic.profPicThumb = thumbnailer.getAppropriateThumbnail(data.photos[i],
                                    PROF_PIC_SIZE);
                        }
                        data.photos[i].thumb = thumbnailer.getAppropriateThumbnail(data.photos[i],
                                PHOTO_THUMB_SIZE);
                    }
                }
                
                /* We have our truck. Let's check if logged in and following */
                if (request.session.user) {
                    data.user  = request.session.user;
                    var userId = data.user.id;
                    db.query(SQL_GET_FOLLOWS, [userId, data.truck.id], function(err, res) {
                        if(err) {
                            console.error(err);
                            return fourOhFourRoute(request, response, data);
                        }

                        /* user is following this truck already */
                        if (res.rows.length) {
                            data.following = true;
                        }

                        response.render('truck', data);
                    });
                } else {
                    response.render('truck', data);
                }
            });
        });
    });
}

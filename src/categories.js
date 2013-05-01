/*
 * Handles logic for dealing with categories.
 */
var db = require('./db.js').Database;
var _ = require('underscore');

/* SQL Queries */
var SQL_GET_CATEGORIES = 'SELECT * FROM categories ORDER BY name ASC;';
var SQL_GET_CLASSIFICATIONS = 'SELECT categories.* FROM classified_as ' +
                                                  'INNER JOIN categories ' +
                                                  'ON classified_as.catid = categories.id ' +
                                                  'WHERE classified_as.truckid = $1';
var SQL_CLASSIFY_TRUCK = 'INSERT INTO classified_as (catid, truckid) VALUES($1, $2)';
var SQL_DECLASSIFY_TRUCK = 'DELETE FROM classified_as WHERE catid = $1 AND truckid = $2';

/*
 * Gets all possible categories in the database.
 */
exports.getAllCategories = function(callback) {
    db.query(SQL_GET_CATEGORIES, [], function(err, res) {
        if(err) {
            console.error(err);
            callback(err, null);
        } else {
            callback(err, res.rows ? res.rows : []);
        }
    });
};

/*
 * Gets all of the categories assigned to the given truckid.
 */
exports.getTrucksCategories = function(truckid, callback) {
    db.query(SQL_GET_CLASSIFICATIONS, [truckid], function(err, res) {
        if(err) {
            console.error(err);
            callback(err, null);
        } else {
            callback(err, res.rows ? res.rows : []);
        }
    });
};

/*
 * Classifies the truck as the given category. The callback is
 * optional.
 */
exports.classifyTruck = function(truckid, catid, callback) {
    db.query(SQL_CLASSIFY_TRUCK, [catid, truckid], function(err, res) {
        if(err) {
            console.error(err);
        }
        if(callback) {
            callback(err);
        }
    });
};

/*
 * Deletes a classification for a particular truck. The callback is
 * optional.
 */
exports.declassifyTruck = function(truckid, catid, callback) {
    db.query(SQL_DECLASSIFY_TRUCK, [catid, truckid], function(err, res) {
        if(err) {
            console.error(err);
        }
        if(callback) {
            callback(err);
        }
    });
};

/*
 * Takes a truckid and a set of category ids and sets the truck to be in
 * those categories and only those categories.
 *
 * TODO: Support a callback.
 */
exports.setClassifications = function(truckid, catids) {
    catids = _.map(catids, function(x) { return parseInt(x, 10); });
    exports.getTrucksCategories(truckid, function(err, cats) {
        if(err) {
            console.error(err);
            return;
        }
        
        console.log("current cats ", cats);
        console.log("recieved catids ", catids);
        var currentCatids = {};
        for(var i = 0; i < cats.length; i++) {
            currentCatids[cats[i].id] = true;
            if(catids.indexOf(parseInt(cats[i].id, 10) == -1)) {
                exports.declassifyTruck(truckid, cats[i].id);
            }
        }
        console.log('currentCatids', currentCatids);
        for(i = 0; i < catids.length; i++) {
            if(!currentCatids[catids[i]]) {
                exports.classifyTruck(truckid, catids[i]);
            }
        }

    });
};

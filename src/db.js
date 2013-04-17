/*
 * A database abstraction on top of a database abstraction. We're getting
 * enterprise up in here.
 */
var anydb = require('any-db');
var Config = require('./config.js').Config;

/* SQL QUERIES, BRAH */
var SQL_GET_LAST_ID = 'SELECT lastval() as id;';

var Database = {

    connPool: null,

    getDSN: function() {
        var dbinfo = Config.data.db;
        return 'postgres:' + 
               dbinfo.user + ':' +
               dbinfo.password + '@' +
               dbinfo.host + '/' +
               dbinfo.dbname;
    },

    init: function() {
        this.connPool = anydb.createPool(this.getDSN(), {});
    },

    get: function(callback) {
        this.connPool.acquire(callback);
    },

    /* Acquires a connection and begins a transaction. */
    begin: function(callback) {
        this.connPool.begin(callback);
    },

    release: function(conn) {
        this.connPool.release(conn);
    },

    /* Performs the given query with the given parameters. When all
     * results have been retrieved, the callback will be invoked. The
     * first argument to the callback is an error, if any occurred. The
     * second is the result.
     */
    query: function(sql, params, callback) {
        this.connPool.query(sql, params, function(err, res) {
            console.log(sql);
            if(err) { console.error(err); return callback(err, null); }
            callback(null, res);
        });
    },

    /* Performs the given insert query with the given parameters. Then,
     * within the same transaction runs a lastval() query to get the id
     * assigned to the inserted row. The first argument to the callback is
     * an error, if any occurred. The second is the new id.
     */
    insertAndGetId: function(insertstmt, params, callback) {
        this.begin(function(err, tx) {
            if(err) { return callback(err, null); }

            tx.query(insertstmt, params, function(err, res) {
                if(err) { return callback(err, null); }

                tx.query(SQL_GET_LAST_ID, [], function(err, res) {
                    if(err) { return callback(err, null); }

                    tx.commit();

                    callback(null, res.rows[0].id);
                });
            });
        });
    }

};

exports.Database = Database;

/*
 * A database abstraction on top of a database abstraction. We're getting
 * enterprise up in here.
 */
var anydb = require('any-db');
var Config = require('./config.js').Config;

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

    release: function(conn) {
        this.connPool.release(conn);
    }

};

exports.Database = Database;

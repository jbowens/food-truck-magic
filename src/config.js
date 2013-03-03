/*
 * Config object that stores global configuration data.
 */
'use strict';
var fs = require('fs');

var Config = Object.create({
 
    initialized: false,
    data: {},

    loadGlobalConfigFile: function(callback) {
        
        /*
         * Import config settings from the global config file.
         */
        fs.readFile('../config.json', 'utf8', function (err, data) {
            if(err) {
                console.log(err);
            } else {
                for(var k in data) {
                    this.data[k] = data[k];
                }
            }
        });

        if( callback ) {
            callback();
        }

    },

    /*
     * Initializes the global configuration data and calls the given
     * callback when finished.
     */
    init: function(callback) {
     
        this.loadGlobalConfigFile();

        this.initialized = true;

        if( callback ) {
            callback();
        }

    }

});

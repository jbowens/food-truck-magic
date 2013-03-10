/*
 * Config object that stores global configuration data.
 */
'use strict';
var fs = require('fs');

var Config = Object.create({
 
    data: {},

    init: function(callback) {
        
        var _this = this; 
        /*
         * Import config settings from the global config file.
         */
        fs.readFile('./config.json', 'utf8', function(err, data) {
            var jsonData = JSON.parse(data);
            if (err) {
                console.error(err);
            } else {
                for (var k in jsonData) {
                    _this.data[k] = jsonData[k];
                }
            }

            callback();
        });

    }

});

exports.Config = Config;

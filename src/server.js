/*
 * Food trucks, brah.
 */
"use strict";

var express = require("express");

var app = express();

var port = 8080;

app.use("/public", express.static(__dirname + '/public'));

app.listen(port, function () {
    console.log('- Server listening on port ' + port);
});

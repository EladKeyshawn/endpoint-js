"use strict";

const express = require('express');
const http = require('http');
let app = express();
require('../endpoint')(app,{prefix:"", test:true});


http.createServer(app).listen(4321, function() {
    console.log('test: listening now to port 4321\n');

});

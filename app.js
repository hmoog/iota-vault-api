'use strict';

// requirements
const mongoose = require('mongoose');
const config = require('./config/config.js');
const server = require('./src/rest-server');

// connect to the database ...
mongoose.connect(config.database).then((connection) => {

    // ... and launch our server
    server.listen(config.web_server_port, function() {
        console.log('server running at: %s', server.url);
    });

}, (err) => {

    // show error for debugging
    console.error('connection to database failed!')
    console.error(err);

    // exit the process
    process.exit(1);

});
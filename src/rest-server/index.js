'use strict';

// requirements
const restify = require('restify');
const twoFactorAuth = require('./middleware/twoFactorAuth')({maxDelta: 0});
const seedEndPoint = require('./endpoints/seed');

// setup the server
var server = restify.createServer({
    name: 'iota-vault-api'
});

// configure the server middleware
server.use(restify.plugins.authorizationParser());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

// expose the endpoints
server.post('/seed',                seedEndPoint.create);
server.get ('/seed', twoFactorAuth, seedEndPoint.retrieve);

// make this module available to our app
module.exports = server;
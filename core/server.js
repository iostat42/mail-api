var express     = require('express'),
    path        = require('path'),
    fs          = require('fs'),
    middlewares = require('./middlewares'),
    mailboxes   = require('./routes/mailboxes'),
    messages    = require('./routes/messages'),

    server      = express(),
    httpServer;

if (fs.existsSync(path.resolve(__dirname, '../config.js'))) {
    var config = require('../config');
    for(var key in config) {
        server.set(key, config[key]);
    }
}

module.exports = {
    listen: function () {
        server.use(middlewares.accessControl);

        server.use(express.compress());
        server.use(express.urlencoded());

        messages(server);
        mailboxes(server);

        server.use(middlewares.error);

        httpServer = server.listen.apply(server, arguments);
    },
    close: function () {
        httpServer.close();
    }
};

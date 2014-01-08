var express     = require('express'),
    path        = require('path'),
    fs          = require('fs'),
    middlewares = require('./middlewares'),
    mailboxes   = require('./routes/mailboxes'),
    messages    = require('./routes/messages'),
    sockets    = require('./routes/sockets'),

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

        sockets(server, httpServer);
    },
    close: function () {
        httpServer.close();
    },
    set: function () {
        return server.set.apply(server, arguments);
    },
    get: function () {
        return server.get.apply(server, arguments);
    }
};

var express     = require('express'),
    middlewares = require('./middlewares'),
    mailboxes   = require('./routes/mailboxes'),
    messages    = require('./routes/messages'),

    server      = express(),
    httpServer;

module.exports = {
    listen: function () {
        var args = arguments;

        server.use(function (req, res, next) {
            //TODO make it configureable
            res.setHeader('Access-Control-Allow-Origin', '*');
            next();
        });

        server.use(express.compress());
        server.use(express.urlencoded());

        messages(server);
        mailboxes(server);

        server.use(middlewares.error);

        httpServer = server.listen.apply(server, args);
    },
    close: function () {
        httpServer.close();
    }
};

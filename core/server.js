var express     = require('express'),
    middlewares = require('./middlewares'),
    mailboxes   = require('./routes/mailboxes'),
    messages    = require('./routes/messages'),

    server      = express(),
    httpServer;

module.exports = {
    listen: function () {
        var args = arguments;

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

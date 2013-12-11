var inbox       = require('inbox'),
    express     = require('express'),
    config      = require('../config'),
    mailboxes   = require('./routes/mailboxes'),
    messages    = require('./routes/messages'),

    server      = express(),
    httpServer,
    imapClient;

module.exports = {
    listen: function () {
        var args = arguments;

        server.use(express.bodyParser());

        imapClient = inbox.createConnection(config.imap.port, config.imap.host, config.imap);
        imapClient.connect();
        imapClient.on("connect", function () {
            messages(server, imapClient);
            mailboxes(server, imapClient);
            httpServer = server.listen.apply(server, args);
        });
    },
    close: function () {
        httpServer.close();
        imapClient.close();
    }
};

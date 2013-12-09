/*jslint node: true */
"use strict";

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
        imapClient  = inbox.createConnection(config.imap.port, config.imap.host, {
            secureConnection: config.imap.secureConnection,
            auth: {
                user: config.imap.user,
                pass: config.imap.password
            }
        });
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
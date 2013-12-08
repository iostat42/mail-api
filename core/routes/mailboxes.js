/*jslint node: true */
"use strict";

var inbox       = require('inbox'),
    util        = require('../util'),
    config      = require('../../config'),

    imapClient  = inbox.createConnection(config.imap.port, config.imap.host, {
        secureConnection: config.imap.secureConnection,
        auth: {
            user: config.imap.user,
            pass: config.imap.password
        }
    });

function makeCallback(req, res) {
    return function (error, mailboxes) {
        if (error) {
            util.error(error);
            return res.json(500, { message: "Error" });
        }
        res.json({ items: mailboxes });
    };
}

function registerRoutes(server) {
    server.get('/mailboxes', function (req, res) {
        imapClient.listMailboxes(makeCallback(req, res));
    });
}

module.exports = function (server) {
    imapClient.connect();
    imapClient.on("connect", function () {
        registerRoutes(server);
    });
};

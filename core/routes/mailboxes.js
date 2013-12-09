/*jslint node: true */
"use strict";

var util        = require('../util');

function makeCallback(req, res) {
    return function (error, mailboxes) {
        if (error) {
            util.error(error);
            return res.json(500, { message: "Error" });
        }
        res.json({ items: mailboxes });
    };
}

function registerRoutes(server, imapClient) {
    server.get('/mailboxes', function (req, res) {
        imapClient.listMailboxes(makeCallback(req, res));
    });
}

module.exports = function (server, imapClient) {
    registerRoutes(server, imapClient);
};
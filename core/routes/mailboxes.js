/*jslint node: true */
"use strict";

module.exports = function (server, imapClient) {
    server.get('/mailboxes', function (req, res) {
        imapClient.listMailboxes(function (error, mailboxes) {
            if (error) {
                return res.json(500, { message: error });
            }
            res.json(200, { items: mailboxes });
        });
    });
};

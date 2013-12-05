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
    
imapClient.connect();


function makeCallback(req, res) {
    return function (error, mailboxes) {
        if(error) {
            util.error(error);
            return res.json(500, { message: "Error" });
        }
        res.json({ items: mailboxes });
    };
}

module.exports = function(server) {
    server.get('/mailboxes', function(req, res) {
        imapClient.listMailboxes(makeCallback(req, res));
    });
    
};

var inbox       = require('inbox'),
    config      = require('../config'),

    imapClient  = inbox.createConnection(config.imap.port, config.imap.host, {
        secureConnection: config.imap.secureConnection,
        auth:{
            user: config.imap.user,
            pass: config.imap.password
        }
    });
    

module.exports = function(server) {
    server.get('/mailboxes', function(req, res) {
        imapClient.listMailboxes(function(result) {
            console.log(result);
            res.json(result);
        });
    });
    
};

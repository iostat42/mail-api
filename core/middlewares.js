var config      = require('../config'),
    inbox       = require('inbox');

module.exports = {
    imap: function (req, res, next) {
        req.imap = inbox.createConnection(config.imap.port, config.imap.host, config.imap);
        req.imap.connect();
        req.imap.once('connect', next);
        req.once('end', function () {
            req.imap.close();
        });
    }
};

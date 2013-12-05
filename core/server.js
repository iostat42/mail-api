var express     = require('express'),
    _           = require('underscore'),
    
    config      = require('../config'),
    mailboxes   = require('./routes/mailboxes'),
    messages    = require('./routes/messages'),
    
    server      = express();

// Register routes
mailboxes(server);
messages(server);

module.exports = server;

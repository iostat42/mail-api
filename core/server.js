var express     = require('express'),
    _           = require('underscore'),
    
    config      = require('../config'),
    mailboxes   = require('./mailboxes'),
    messages    = require('./messages'),
    
    server      = express();
    

// Register routes
mailboxes(server);
messages(server);

module.exports = server;

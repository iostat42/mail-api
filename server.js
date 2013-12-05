var express     = require('express'),
    _           = require('underscore'),
    
    config      = require('./config'),
    mailboxes    = require('./core/mailboxes'),
    messages    = require('./core/messages'),
    
    server      = express();
    

// Register routes
mailboxes(server);
messages(server);

server.listen(config.server.port);

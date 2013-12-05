var config      = require('./config'),
    server      = require('./core/server');

server.listen(config.server.port);

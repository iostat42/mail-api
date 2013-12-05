var inbox       = require('inbox'),
    util        = require('./util'),
    config      = require('../config'),

    imapClient  = inbox.createConnection(null, config.imap.host, {
        secureConnection: config.imap.secureConnection,
        auth:{
            user: config.imap.user,
            pass: config.imap.password
        }
    });
    
imapClient.connect();
    
    
module.exports = function(server) {
    // Retrieve messages
    server.get('/messages', function(req, res) {
        
    });
    
    // Send message
    server.post('/messages', function(req, res) {
        
    });
    
    // Delete message
    server.delete('/messages', function(req, res) {
        
    });
    
};

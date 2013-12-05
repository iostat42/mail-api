var inbox       = require('inbox'),
    config      = require('../config'),

    imapClient  = inbox.createConnection(config.imap.port, config.imap.host, {
        secureConnection: true,
        auth:{
            user: config.imap.user,
            pass: config.imap.password
        }
    });
    
    
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

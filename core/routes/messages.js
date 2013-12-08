/*jslint node: true */
"use strict";

var util        = require('../util');
    
function registerRoutes(server, imapClient) {
    // Retrieve messages
    server.get('/messages', function (req, res) {
        
    });
    
    // Send message
    server.post('/messages', function (req, res) {
        
    });
    
    // Delete message
    server.delete('/messages', function (req, res) {
        
    });
}
    
module.exports = function (server, imapClient) {
    registerRoutes(server, imapClient);
};

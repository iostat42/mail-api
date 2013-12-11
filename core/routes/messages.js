var _           = require('underscore'),
    nodemailer  = require('nodemailer'),
    config      = require('../../config'),
        
    transport = nodemailer.createTransport('SMTP', config.smtp);

module.exports = function (server, imapClient) {
    // GET /messages
    // -------------
    //  Retrieve all messages
    server.get('/messages', function (req, res) {
        
    });
    
    // POST /messages
    // --------------
    //  Send message
    server.post('/messages', function (req, res) {
        transport.sendMail(_.pick(req.body, 'from', 'to', 'subject', 'text', 'html'), function (error, response) {
            if (error) {
                return res.json(500, { message: error.data });
            }
            res.json(200, { message: response.message });
        });
    });
    
    // DELETE /messages
    // ----------------
    // Delete message
    server.delete('/messages', function (req, res) {
        
    });
};

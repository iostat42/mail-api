/*jslint node: true */
"use strict";

var nodemailer = require('nodemailer'),
    config = require('../../config'),
        
    transport = nodemailer.createTransport('SMTP', config.smtp);

module.exports = function (server, imapClient) {
    // Retrieve messages
    server.get('/messages', function (req, res) {
        
    });
    
    // Send message
    server.post('/messages', function (req, res) {
        transport.sendMail({
            from: req.body.from,
            to: req.body.to,
            subject: req.body.subject,
            text: req.body.text,
            html: req.body.html
        }, function (error, response) {
            if (error) {
                return res.json(500, { message: error.data });
            }
            res.json(200, { message: response.message });
        });
    });
    
    // Delete message
    server.delete('/messages', function (req, res) {
        
    });
};

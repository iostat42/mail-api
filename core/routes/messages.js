var _           = require('underscore'),
    nodemailer  = require('nodemailer'),
    config      = require('../../config'),

    transport = nodemailer.createTransport('SMTP', config.smtp);

module.exports = function (server, imapClient) {
    //  Retrieve all messages
    server.get('/messages', function (req, res) {

    });

    //  Send message
    server.post('/messages', function (req, res) {
        transport.sendMail(_.pick(req.body, 'from', 'to', 'subject', 'text', 'html'), function (error, response) {
            if (error) {
                return res.json(500, { message: error.message });
            }
            res.json(200, { message: response.message });
        });
    });

    // Delete message
    server.delete('/messages', function (req, res) {

    });
};

var _           = require('underscore'),
    nodemailer  = require('nodemailer'),
    config      = require('../../config'),

    transport = nodemailer.createTransport('SMTP', config.smtp),
    MAXLIMIT = 500,
    DEFAULTLIMIT = 50;

module.exports = function (server, imapClient) {

    // Open mailbox if req.query.path is set
    server.all('/messages', function (req, res, next) {
        if(req.query.path) {
            imapClient.openMailbox(req.query.path, function (error, info) {
                if(error) {
                    return res.json(500, { message: error.message });
                }
                next();
            });
        } else {
            next();
        }
    });

    //  Retrieve all messages
    server.get('/messages', function (req, res) {
        imapClient.listMessages(req.body.from || 0,
            req.body.limit && req.body.limit < MAXLIMIT ? req.body.limit : DEFAULTLIMIT,
            function (error, messages) {
                if(error) {
                    return res.json(500, { message: error.message });
                }
                res.json(200, messages);
            }
        );
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

var _           = require('underscore'),
    middlewares = require('../middlewares'),

    MAXLIMIT = 500,
    DEFAULTLIMIT = 50;

module.exports = function (server) {

    server.all('/messages*', middlewares.auth, middlewares.imap, middlewares.smtp);

    // Open mailbox if req.query.path is set
    server.all('/messages', function (req, res, next) {
        if(req.query.path) {
            req.imap.openMailbox(req.query.path, function (error, info) {
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
        req.imap.listMessages(req.body.from || 0,
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
        req.smtp.sendMail(_.pick(req.body, 'from', 'to', 'subject', 'text', 'html'), function (error, response) {
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

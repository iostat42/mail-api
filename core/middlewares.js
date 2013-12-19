var inbox       = require('inbox'),
    nodemailer  = require('nodemailer'),
    auth        = require('basic-auth');
    
module.exports = {
    imap: function (req, res, next) {
        req.imap = inbox.createConnection(req.rauth.imap.port, req.rauth.imap.host, req.rauth.imap);
        req.imap.connect();
        req.once('end', function () {
            req.imap.close();
        });
        req.imap.once('connect', next);
    },

    smtp: function (req, res, next) {
        req.smtp = nodemailer.createTransport('SMTP', req.rauth.smtp);
        req.once('end', function () {
            req.smtp.close();
        });
        next();
    },

    auth: function (req, res, next) {
        var user = auth(req);
        res.setHeader('WWW-Authenticate', 'Basic realm="api"');
        if(!user || !req.app.get('auth')[user.pass]) {
            var error = new Error("Unauthorized");
            error.statusCode = 401;
            return next(error);
        }
        req.rauth = req.app.get('auth')[user.pass];
        next();
    },

    error: function (err, req, res, next) {
        res.json(err.statusCode || 500, { message: err.message });
    },
    accessControl: function (req, res, next) {
         //TODO make it configureable
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'HEAD,GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Authorization');
        // intercept OPTIONS method
        if ('OPTIONS' === req.method) {
            res.header('Allow', 'HEAD,GET,PUT,POST,DELETE,OPTIONS');
            res.send(200);
        } else {
            next();
        }
    }
};

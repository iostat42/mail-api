var inbox       = require('inbox'),
    nodemailer  = require('nodemailer'),
    auth        = require('basic-auth'),
    config      = require('../config');

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
        if(!user || !config.auth[user.pass]) {
            var error = new Error("Unauthorized");
            error.statusCode = 401;
            return next(error);
        }
        req.rauth = config.auth[user.pass];
        next();
    },

    error: function (err, req, res, next) {
        res.json(err.statusCode || 500, { message: err.message });
    }
};

/*jslint node: true */
/*global describe, it, before, done, after */
"use strict";

process.env.NODE_ENV = 'testing';

var assert          = require('assert'),
    http            = require('http'),
    hoodiecrow      = require("hoodiecrow"),
    apiServer       = require('../core/server'),
    config          = require('../config'),
    
    url             = 'http://localhost:' + config.server.port,
    imapServer      = hoodiecrow({
        plugins: ["IDLE"],
        storage: {
            "INBOX": {
                messages: [
                    {raw: "Subject: hello 1\r\n\r\nWorld 1!", internaldate: "14-Sep-2013 21:22:28 -0300"},
                    {raw: "Subject: hello 2\r\n\r\nWorld 2!", flags: ["\\Seen"]},
                    {raw: "Subject: hello 3\r\n\r\nWorld 3!"},
                    {raw: "From: sender name <sender@example.com>\r\n" +
                        "To: Receiver name <receiver@example.com>\r\n" +
                        "Subject: hello 4\r\n" +
                        "Message-Id: <abcde>\r\n" +
                        "Date: Fri, 13 Sep 2013 15:01:00 +0300\r\n" +
                        "\r\n" +
                        "World 4!"},
                    {raw: "Subject: hello 5\r\n\r\nWorld 5!"},
                    {raw: "Subject: hello 6\r\n\r\nWorld 6!"}
                ]
            }
        }
    });

describe('server', function () {
    it('should start server', function (done) {
        imapServer.listen(config.imap.port, function () {
            apiServer.listen(config.server.port, done);
        });
    });

    after(function () {
        imapServer.close();
        apiServer.close();
    });
});

describe('/mailboxes', function () {
    it('should return 200', function (done) {
        console.log(url + '/mailboxes');
        http.get(url + '/mailboxes', function (res) {
            assert.equal(200, res.statusCode);
            done();
        });
    });
});
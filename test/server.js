/*jslint node: true */
/*global describe, it */
"use strict";

process.env.NODE_ENV = 'testing';

var assert          = require('assert'),
    hoodiecrow      = require("hoodiecrow"),
    request         = require('request'),
    apiServer       = require('../core/server'),
    config          = require('../config'),
    
    url             = 'http://localhost:' + config.server.port,
    imapServer      = hoodiecrow({
        plugins: ["ID", "STARTTLS", "SASL-IR", "AUTH-PLAIN", "NAMESPACE", "IDLE", "ENABLE", "CONDSTORE", "XTOYBIRD", "LITERALPLUS", "UNSELECT", "SPECIAL-USE", "CREATE-SPECIAL-USE"],
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
            },
            "": {
                "separator": "/",
                "folders": {
                    "[Gmail]": {
                        "flags": ["\\Noselect"],
                        "folders": {
                            "All Mail": {
                                "special-use": "\\All"
                            },
                            "Drafts": {
                                "special-use": "\\Drafts"
                            },
                            "Important": {
                                "special-use": "\\Important"
                            },
                            "Sent Mail": {
                                "special-use": "\\Sent"
                            },
                            "Spam": {
                                "special-use": "\\Junk"
                            },
                            "Starred": {
                                "special-use": "\\Flagged"
                            },
                            "Trash": {
                                "special-use": "\\Trash"
                            }
                        }
                    }
                }
            }
        }
    });

describe('server', function () {
    it("should start server", function (done) {
        imapServer.listen(config.imap.port, function () {
            apiServer.listen(config.server.port, function () {
				done();
			});
        });
    });
});

describe('/mailboxes', function () {
    it('should return list of mailboxes', function (done) {
        request(url + '/mailboxes', function (error, response, body) {
            assert.equal(!!error, false);
            assert.equal(200, response.statusCode);
            assert.equal('{"items":[{"name":"[Gmail]","path":"[Gmail]","type":"Normal","delimiter":"/","hasChildren":true}]}', body);
            done();
        });
    });
});

describe('server', function () {
    it("should close server", function (done) {
        imapServer.close();
        apiServer.close();
        done();
    });
});

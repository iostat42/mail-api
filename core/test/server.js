/*global describe, it */

process.env.NODE_ENV = 'testing';

var assert          = require('assert'),
    hoodiecrow      = require("hoodiecrow"),
    simplesmtp      = require('simplesmtp'),
    request         = require('request'),
    MailParser      = require("mailparser").MailParser,
    apiServer       = require('../server'),
    config          = require('../../config'),

    url             = 'http://localhost:' + config.server.port,
    mailparser = new MailParser(),
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
        simplesmtp.createSimpleServer({SMTPBanner: "My Server"}, function (req) {
            req.pipe(mailparser);
            req.accept();
        }).listen(config.smtp.port);
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
    it('should return single mailbox', function (done) {
        request(url + '/mailboxes/[Gmail]', function (error, response, body) {
            assert.equal(!!error, false);
            assert.equal(200, response.statusCode);
            done();
        });
    });
    it('should return 404 for unknown mailbox', function (done) {
        request(url + '/mailboxes/thisdoesnotexist', function (error, response, body) {
            assert.equal(!!error, false);
            assert.equal(404, response.statusCode);
            assert.equal('{"message":"Mailbox not found"}', body);
            done();
        });
    });
});

describe('/messages', function () {
    it('should fail if no mailbox selected', function (done) {
        request.get(url + '/messages', function (error, response, body) {
            assert.equal(!!error, false);
            assert.equal(500, response.statusCode);
            assert.equal('{"message":"No mailbox selected"}', body);
            done();
        });
    });
    it('should return list of messages', function (done) {
        request.get(url + '/messages', { qs: { path: "INBOX" }}, function (error, response, body) {
            assert.equal(!!error, false);
            assert.equal(200, response.statusCode);
            assert.equal('hello 1', JSON.parse(body)[0].title);
            done();
        });
    });
    it('should send message', function (done) {
        mailparser.once("end", function(mail_object){
            assert(mail_object.from, "from@localhost");
            assert(mail_object.to, "to@localhost");
            assert(mail_object.subject, "test");
            assert(mail_object.text, "Just a test");
            done();
        });
        request.post(url + '/messages', { form: {
            from: "from@localhost",
            to: "to@localhost",
            subject: "test",
            text: "Just a test"
        }}, function (error, response, body) {
            assert.equal(!!error, false);
            assert.equal(200, response.statusCode);
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

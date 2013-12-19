/*global describe, it */

process.env.NODE_ENV = 'testing';

var assert          = require('assert'),
    hoodiecrow      = require("hoodiecrow"),
    simplesmtp      = require('simplesmtp'),
    request         = require('request'),
    io              = require('socket.io-client'),
    MailParser      = require("mailparser").MailParser,
    apiServer       = require('../server'),
    config          = require('../../config'),

    url             = 'http://localhost:' + config.server.port,
    mailparser      = new MailParser(),
    auth            =  {
        'user': 'something',
        'pass': 'testingtoken'
    },
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
        }).listen(config.auth.testingtoken.smtp.port);
        imapServer.listen(config.auth.testingtoken.imap.port, function () {
            apiServer.listen(config.server.port, function () {
                done();
            });
        });
    });
});

describe('/mailboxes', function () {
    it('should forbid access without authentication', function (done) {
        request(url + '/mailboxes', function (error, response, body) {
            assert.ifError(error);
            assert.strictEqual(response.statusCode, 401);
            done();
        });
    });
    it('should return list of mailboxes', function (done) {
        request(url + '/mailboxes', { auth: auth }, function (error, response, body) {
            assert.ifError(error);
            assert.strictEqual(response.statusCode, 200);
            assert.strictEqual(body, '[{"name":"[Gmail]","path":"[Gmail]","type":"Normal","delimiter":"/","hasChildren":true}]');
            done();
        });
    });
    it('should return single mailbox', function (done) {
        request(url + '/mailboxes/[Gmail]', { auth: auth }, function (error, response, body) {
            assert.ifError(error);
            assert.strictEqual(response.statusCode, 200);
            done();
        });
    });
    it('should return 404 for unknown mailbox', function (done) {
        request(url + '/mailboxes/thisdoesnotexist', { auth: auth }, function (error, response, body) {
            assert.ifError(error);
            assert.strictEqual(response.statusCode, 404);
            assert.strictEqual(body, '{"message":"Mailbox not found"}');
            done();
        });
    });
});

describe('/messages', function () {
    it('should forbid access without authentication', function (done) {
        request(url + '/messages', function (error, response, body) {
            assert.ifError(error);
            assert.strictEqual(response.statusCode, 401);
            done();
        });
    });
    it('should fail if no mailbox selected', function (done) {
        request.get(url + '/messages', { auth: auth }, function (error, response, body) {
            assert.ifError(error);
            assert.strictEqual(response.statusCode, 500);
            assert.strictEqual(body, '{"message":"No mailbox selected"}');
            done();
        });
    });
    it('should return list of messages', function (done) {
        request.get(url + '/messages', { auth: auth, qs: { path: "INBOX" }}, function (error, response, body) {
            assert.ifError(error);
            assert.strictEqual(response.statusCode, 200);
            assert.strictEqual(JSON.parse(body)[0].title, 'hello 1');
            done();
        });
    });
    it('should return single message', function (done) {
        request.get(url + '/messages/1', { auth: auth, qs: { path: "INBOX" }}, function (error, response, body) {
            assert.ifError(error);
            assert.strictEqual(response.statusCode, 200);
            assert.strictEqual(JSON.parse(body).title, 'hello 1');
            done();
        });
    });
    it('should return 404 for unknown message', function (done) {
        request.get(url + '/messages/100', { auth: auth, qs: { path: "INBOX" }}, function (error, response, body) {
            assert.ifError(error);
            assert.strictEqual(response.statusCode, 404);
            done();
        });
    });
    it('should send message', function (done) {
        mailparser.once("end", function(mail_object){
            assert.strictEqual(mail_object.headers.from, "from@localhost");
            assert.strictEqual(mail_object.headers.to, "to@localhost");
            assert.strictEqual(mail_object.headers.subject, "test");
            assert.strictEqual(mail_object.text, "Just a test");
            done();
        });
        request.post(url + '/messages', { auth: auth, form: {
            from: "from@localhost",
            to: "to@localhost",
            subject: "test",
            text: "Just a test"
        }}, function (error, response, body) {
            assert.ifError(error);
            assert.strictEqual(response.statusCode, 201);
        });
    });
    it('should store message', function (done) {
        request.put(url + '/messages',  { auth: auth, form: {
            body: "stuff",
            path: "INBOX"
        }}, function (error, response, body) {
            assert.ifError(error);
            assert.strictEqual(response.statusCode, 201);
            done();
        });
    });
    it('should delete message', function (done) {
        request.del(url + '/messages/' + 7,  { auth: auth, qs: { path: "INBOX" }}, function (error, response, body) {
            assert.ifError(error);
            assert.strictEqual(response.statusCode, 200);
            assert.strictEqual(body, '{"message":"Message deleted"}');
            done();
        });
    });
    it('should subscribe to new messages', function (done) {
        var socket = io.connect('http://localhost/', { log: false, port: config.server.port });
        socket.on('connect', function () {
            socket.emit('auth', { key:  'testingtoken' });
            socket.on('authenticated', function () {
                socket.emit('subscribe new message');
                socket.on('subscribed', function () {
                    request.put(url + '/messages',  { auth: auth, form: {
                        body: "Subject: hello 11\r\n\r\nWorld 11!",
                        path: "INBOX"
                    }}, function (error, res, body) {
                        assert.ifError(error);
                    });
                });
            });

            socket.on('new message', function (message) {
                assert.strictEqual(message.title, "hello 11");
                done();
            });
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

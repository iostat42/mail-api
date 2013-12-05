// Must be set before requiring config
process.env.NODE_ENV = 'testing';

var frisby			= require('frisby'),
    config			= require('../config'),
    hoodiecrow      = require("hoodiecrow"),
    data            = require('./data'),
    apiServer       = require('../core/server'),
    imapServer      = hoodiecrow(data.hoodiecrow),
    url             = 'localhost:' + config.server.port; 

describe("Asynchronous specs", function() {
    var flag;

    it("should start imap server", function() {
        runs(function() {
            flag = false;
            imapServer.listen(config.imap.port);
            flag = true;
        });
        waitsFor(function() {
            return flag;
        }, "The imap server should be started", 1000);
    });

    it("should start api server", function() {
        runs(function() {
            flag = false;
            apiServer.listen(config.server.port, function() {
                flag = true;
            });
        });
        waitsFor(function() {
            return flag;
        }, "The api server should be started", 1000);
    });
});

console.log(url + '/mailboxes');

// Run tests
frisby.create('Get mailboxes')
    .get(url + '/mailboxes')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .toss();

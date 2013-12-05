// Must be set before requiring config
process.env.NODE_ENV = 'testing';

var frisby			= require('frisby'),
    config			= require('../config'),
    apiServer       = require('../core/server'),
    url             = 'localhost:' + config.server.port; 

describe("Asynchronous specs", function() {
    var flag;

    it("should start imap server", function() {
        runs(function() {
            flag = false;
            require('./hoodiecrow');
            flag = true;
        });
        waitsFor(function() {
            return flag;
        }, "The imap server should be started", 1000);
        runs(function() {});
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
        runs(function() {});
    });
});

// Run tests
frisby.create('Get mailboxes')
    .get(url + '/mailboxes')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .toss();

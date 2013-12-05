// Must be set before requiring config
process.env.NODE_ENV = 'testing';

var frisby			= require('frisby'),
    config			= require('../config'),

// Run server
require('../server');


// Run tests
frisby.create('Get mailboxes')
    .get(url + '/mailboxes')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .toss();

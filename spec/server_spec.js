// Must be set before requiring config
process.env.NODE_ENV = 'testing';

var frisby			= require('frisby'),
	net				= require('net'),
	imapServer		= require('imap-server')(),
	config			= require('../config'),
	url				= config.server.url || 'localhost';

// Run dummy imap server
net.createServer(imapServer).listen(config.imap.port);

// Run server
require('../server');


// Run tests

frisby.create('Get mailboxes')
	.get(url + '/mailboxes')
	.expectStatus(200)
	.expectHeaderContains('content-type', 'application/json')
	.toss();

var inbox       = require('inbox'),
    socketio    = require('socket.io');

module.exports = function (server, http) {
    var io = socketio.listen(http, { log: false });
    io.sockets.on('connection', function (socket) {
        socket.on('auth', function (data) {
            if(!data.key || !server.get('auth')[data.key]) {
                return socket.emit('error', { message: 'Invalid key' } );
            }
            socket.set('key', data.key);
            socket.emit('authenticated');
        });
        socket.on('subscribe new message', function () {
            socket.get('key', function (error, key) {
                if(error || !key) {
                    return socket.emit('error', { message: 'Unauthorized' } );
                }
                var imap = inbox.createConnection(server.get('auth')[key].imap.port, server.get('auth')[key].imap.host, server.get('auth')[key].imap);
                imap.on('connect', function () {
                    imap.openMailbox("INBOX", function () {
                        socket.emit('subscribed');
                    });
                });
                imap.on('close', function () {
                    socket.emit('unsubscribed');
                });
                imap.on('new', function (message) {
                    socket.emit('new message', message);
                });
                imap.connect();
            });
        });
    });
};

var server      = require('./core/server');

console.log("Starting server...");
server.listen(server.get('server').port, function () {
    console.log("Server started!");
});

process.on('exit', function () {
    server.close();
    console.log("Server stopped!");
});

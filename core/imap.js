/*
    Copyright (c) 2013, Jakob Gillich
    All rights reserved.
    
    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:
    
    1. Redistributions of source code must retain the above copyright notice, this
       list of conditions and the following disclaimer.
    2. Redistributions in binary form must reproduce the above copyright notice,
       this list of conditions and the following disclaimer in the documentation
       and/or other materials provided with the distribution.
    
    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
    ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
    WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
    ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


(function() {
  var auth, clients, connect, inbox, requireConnect, server;

  inbox = require("inbox");

  auth = require("./auth.js");

  server = module.parent.exports;

  clients = {};

  requireConnect = function(token, connectedCallback, errorCallback) {
    return auth.requireAuth(token, function(authInfo) {
      if (clients[token] != null) {
        return connectedCallback(clients[token]);
      }
      return connect(authInfo, function(client) {
        clients[token] = client;
        return connectedCallback(clients[token]);
      }, errorCallback);
    }, errorCallback);
  };

  connect = function(authInfo, connectedCallback, errorCallback) {
    var client, options;
    options = {
      "secureConnection": true,
      "auth": {
        "user": authInfo.imap.user,
        "pass": authInfo.imap.password
      }
    };
    client = inbox.createConnection(authInfo.imap.port, authInfo.imap.host, options);
    client.connect();
    return client.on("connect", function() {
      return connectedCallback(client);
    });
  };

  server.get("/mailbox", function(req, res, next) {
    return requireConnect(req.authorization.basic.password, function() {
      return clients[req.authorization.basic.password].listMailboxes(function(error, mailboxes) {
        if (error != null) {
          console.log(error);
        }
        return res.send(200, mailboxes);
      });
    }, function(status, error) {
      return res.send(status, {
        "error": error
      });
    });
  });

}).call(this);

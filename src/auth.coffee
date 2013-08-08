###
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
###

# Simple Authentication mechanism based on random tokens
# Needs to be reviewed by experts in the future

crypto = require('crypto')
later = require('later')

sha256 = crypto.createHash('sha256')

# Stores all user data (including passwords as plain text)
# I have no idea if this is a good idea, but sending
# everything with every request doesn't sound very secure either
data = {}

# Empty all data every 60 min
# Clients are supposed to reconnect automatically
# @todo: Implement a timeout
later.setTimeout () ->
    data = {}
, later.parse.text('every 60 min')

module.exports =
    routes:
        "/auth": (req, res, next) ->
            crypto.randomBytes 128, (ex, buf) ->
                token = buf.toString('base64')
                
                data[token] =
                    port: req.params.port
                    host: req.params.host
                    user: req.params.user
                    password: req.params.password
                    #created: new Date()).getTime()
                    
                res.end token

    get: (token) ->
        if data[token]?
            return data[token]
        return null
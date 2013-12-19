---
layout: default
title: mail-api
---

<p id="introduction"><h1>mail-api</h1></p>

A work in progress REST API for IMAP and SMTP.


<h2 id="mailboxes">Mailboxes</h2>

<p id="get-mailboxes">
    <b class="header">GET</b><code>/mailboxes</code>
    <br />Retrieve a list of all root level mailboxes.
</p>

```js
request.get('/mailboxes', { qs: { path: "INBOX" }});
=> [{
        "UIDValidity": "1",
        "path": "INBOX",
        "UID": 1,
        "flags": [],
        "folders": ["INBOX"],
        "type": "Normal",
        "date": "2013-12-12T21:36:29.186Z",
        "title": "hello 1",
        "messageId": ""
    }]
```

<p id="get-mailboxes-path">
    <b class="header">GET</b><code>/mailboxes/:path</code>
    <br />Retrieve single mailbox and all children.
</p>

<h2 id="messages">Messages</h2>

<p id="get-messages">
    <b class="header">GET</b><code>/messages</code>
    <br />Retrieve a list of messages. A mailbox must be passed as <tt>path</tt>.
</p>

```js
request.get('/messages', { qs: { path: "INBOX" }});
=> [{
        "UIDValidity": "1",
        "path": "INBOX",
        "UID": 1,
        "flags": [],
        "folders": ["INBOX"],
        "type": "Normal",
        "date": "2013-12-12T21:36:29.186Z",
        "title": "hello 1",
        "messageId": ""
    }]
```

<p id="get-messages-id">
    <b class="header">GET</b><code>/messages/:id</code>
    <br />Retrieve a single message. A mailbox must be passed as <tt>path</tt>.
</p>

<p id="post-messages">
    <b class="header">POST</b><code>/messages</code>
    <br />Send message
</p>

```js
request.post('/messages', { form: {
    from: "from@localhost",
    to: "to@localhost",
    subject: "test",
    text: "Just a test"
}};
=> { "message": "250 2.0.0 Ok: queued as a7aa7c5d48c14c93e8c9" }
```

<p id="put-messages">
    <b class="header">PUT</b><code>/messages</code>
    <br />Store message. A mailbox must be passed as <tt>path</tt>.
</p>

```js
request.put('/messages', { form: {
    body: "body",
    path: "INBOX"
}});
```

<p id="delete-messages">
    <b class="header">DELETE</b><code>/mailboxes/:id</code>
    <br />Delete message. A mailbox must be passed as <tt>path</tt>.
</p>

```js
request.del('/messages/7', { qs: { path: "INBOX" }});
=> { "message": "Message deleted" }
```

<h2 id="examples">Examples</h2>

<h2 id="conventions">Conventions</h2>

<b>All</b> requests must authenticate using a token as password. Usernames are ignored. For now, tokens are configured in <tt>config.js</tt>.

<b>All</b> responses contain a valid JSON document and are converted by <a href="http://expressjs.com/api.html#res.json">res.json</a>. The content type is <i>application/json</i>.

<b>All</b> successful responses contain a <i>2xx</i> status code. Status codes in the range of <i>4xx</i> and <i>5xx</i> mean an error occured and a description of the error is sent:

```js
=> { "message": "Mailbox not found" }
```

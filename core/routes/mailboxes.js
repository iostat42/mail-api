module.exports = function (server, imapClient) {

    //  Return a list of all root level mailboxes
    server.get('/mailboxes', function (req, res) {
        imapClient.listMailboxes(function (error, mailboxes) {
            if (error) {
                return res.json(500, { message: error.message });
            }
            res.json(200, { items: mailboxes });
        });
    });

    //  Return single mailbox and all children
    server.get('/mailboxes/:path', function (req, res) {
        imapClient.getMailbox(req.params.path, function (error, mailbox) {
            if (error) {
                return res.json(500, { message: error.message });
            }
            if (mailbox) {
                mailbox.children = [];
                if (mailbox.hasChildren) {
                    mailbox.listChildren(mailbox.children.push);
                }
                return res.json(200, mailbox);
            }
            return res.json(404, { message: "Mailbox not found" });
        });
    });
};

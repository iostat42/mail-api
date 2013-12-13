var middlewares = require('../middlewares');

module.exports = function (server) {

    server.all('/mailboxes*', middlewares.imap);

    //  Return a list of all root level mailboxes
    server.get('/mailboxes', function (req, res) {
        req.imap.listMailboxes(function (error, mailboxes) {
            if (error) {
                return res.json(500, { message: error.message });
            }
            res.json(200, mailboxes);
        });
    });

    //  Return single mailbox and all children
    server.get('/mailboxes/:path', function (req, res) {
        req.imap.getMailbox(req.params.path, function (error, mailbox) {
            if (error) {
                return res.json(500, { message: error.message });
            }
            if (mailbox) {
                mailbox.children = [];
                if (mailbox.hasChildren) {
                    mailbox.listChildren(function (error, children) {
                        if(error) {
                            return res.json(500, { message: error.message });
                        }
                        mailbox.children.push(children);
                    });
                }
                return res.json(200, mailbox);
            }
            return res.json(404, { message: "Mailbox not found" });
        });
    });
};

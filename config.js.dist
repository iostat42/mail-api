var config;

// Default NODE_ENV is development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

config = {
    development: {
        server: {
            port: 8080
        },
        imap: {
            user: "",
            password: "",
            host: "localhost",
            port: 993,
            secureConnection: true
        }
    },
    production: {
        server: {
            port: 8080
        },
        imap: {
            user: "",
            password: "",
            host: "localhost",
            port: 993,
            secureConnection: true
        }
    },
    testing: {
        server: {
            port: 8080
        },
        imap: {
            user: "",
            password: "",
            host: "localhost",
            port: 993,
            secureConnection: true
        }
    }
};


module.exports = config[process.env.NODE_ENV];

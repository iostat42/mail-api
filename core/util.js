var _       = require('underscore');

module.exports = {};

module.exports.error = function(message) {
    if(process.env.NODE_ENV === 'production') {
        // TODO: Write to log file?
    } else {
        console.log(JSON.stringify(message));
    }
};

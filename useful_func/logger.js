const moment = require('moment');

//debug feature
const logger = (req, res, next) => {
    console.log(`${moment()} ${req.method} ${req.get('host')}${req.originalUrl}`);
    next();
};

module.exports = logger;
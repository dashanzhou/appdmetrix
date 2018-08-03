const http = require('http');
const winston = require('winston');
const models = require('./models');
const express = require('express');
const initData = require('./initializeAppDdata.js');

winston.configure({
    level: 'debug',
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new(winston.transports.File)({
            filename: 'app.log'
        })
    ]
});

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            winston.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            winston.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

//const app = express()

let port = process.env.PORT || 3000;

const app = require('./setupApp.js');

initData(models).then(() => {
    let server = http.createServer(app);
    server.on('error', onError);
    server.listen(port, function () {
        winston.debug('Express server listening on port ' + server.address().port);
    });
});
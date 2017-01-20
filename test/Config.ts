/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */
var serverConfig = process.env.SERVER
var server = require('../src/App');
if (serverConfig === 'NET') {
    server = 'http://dev.salonhelps.com';
} else {
    server = require('../src/App');
}


export = server;
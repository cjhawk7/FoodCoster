'use strict';
exports.DATABASE_URL =
    process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    'mongodb://cjhawk7:Vageta01!@ds259778.mlab.com:59778/travel-app';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || 10;

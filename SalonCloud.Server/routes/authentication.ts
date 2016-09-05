/*
 * GET users listing.
 */
import express = require('express');
import passport = require('passport');
import jwt = require('jsonwebtoken');
import fs = require('fs');
var ErrorMessage = require('./ErrorMessage');

import {Authentication} from '../core/user/Authentication';
module route {
    export class AuthenticationRoute {        

        /**
         * Check access TOKEN in Request
         * Push user(id, iat, ...) to req.user
         */
        public static verifyToken(req: express.Request, res: express.Response, next) {
            var token = req.headers.authorization;
            var authentication = new Authentication();
            authentication.verifyToken(token, function (err, code, data) {
                if (err) {
                    res.statusCode = code;
                    return res.json(err);
                } else {
                    req.user = data;
                    next();
                }
            });
        }
    }
}
export = route.AuthenticationRoute;
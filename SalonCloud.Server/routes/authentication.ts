/*
 * GET users listing.
 */
import express = require('express');
import passport = require('passport');
import jwt = require('jsonwebtoken');
import fs = require('fs');
var ErrorMessage = require('./ErrorMessage');

var AuthenticationModel = require('../core/authentication/AuthenticationModel');
import {Authentication} from '../core/authentication/Authentication';
module route {
    export class AuthenticationRoute {
        public static signUpWithEmailAndPassword(req: express.Request, res: express.Response) {
            var authentication = new Authentication();
            authentication.signUpWithEmailAndPassword(req.body.username, req.body.password, function (err, code, data) {
                if (err) {
                    res.statusCode = code;
                    return res.json(err);
                } else {
                    res.statusCode = code;
                    return res.json(data);
                }
            });
        }

        public static signInWithEmailAndPassword(req: express.Request, res: express.Response, done) {
            var authentication = new Authentication();
            authentication.signInWithEmailAndPassword(req.body.username, req.body.password, function (err, code, data) {
                if (err) {
                    res.statusCode = code;
                    return res.json(err);
                } else {
                    res.statusCode = code;
                    return res.json(data);
                }
            });
        }

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
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
        public static SignUpWithEmailAndPassword(req: express.Request, res: express.Response) {
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

        public static SignInWithEmailAndPassword(req: express.Request, res: express.Response, done) {
            var authentication = new Authentication();
            authentication.SignInWithEmailAndPassword(req.body.username, req.body.password, function (err, code, data) {
                if (err) {
                    console.log('err ----: %j', err);
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
        public static VerifyToken(req: express.Request, res: express.Response, next) {
            var token = req.headers.authorization;
            if (!token) {
                res.statusCode = 403;
                return res.json(ErrorMessage.InvalidTokenError);
            } else {
                var cert = fs.readFileSync('./config/dev/public.pem');  // get private key
                jwt.verify(token, cert, { algorithms: ['RS256'] }, function (err, payload) {
                    if (err) {
                        res.statusCode = 403;
                        return res.json(ErrorMessage.InvalidTokenError);
                    } else {
                        req.user = payload;
                        next();
                    }
                });


            }
        }
    }
}
export = route.AuthenticationRoute;
/**
 * 
 * 
 * 
 */
import express = require('express');
import passport = require('passport');
import jwt = require('jsonwebtoken');
var ErrorMessage = require('./ErrorMessage');
import {Authentication} from '../core/user/Authentication';
import {Anomymous} from "./../core/user/Anomymous";
module route {
    export class AnomymousRoute {
        public static signUpWithEmailAndPassword(req: express.Request, res: express.Response) {
            var anomymous = new Anomymous(new Authentication());
            anomymous.signUp(req.body.username, req.body.password, function (err, code, data) {
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
            var anomymous = new Anomymous(new Authentication());
            anomymous.signIn(req.body.username, req.body.password, function (err, code, data) {
                if (err) {
                    res.statusCode = code;
                    return res.json(err);
                } else {
                    res.statusCode = code;
                    return res.json(data);
                }
            });
        }
    }
}
export = route.AnomymousRoute;
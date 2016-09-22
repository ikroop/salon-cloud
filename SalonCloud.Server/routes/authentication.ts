/*
 * GET users listing.
 */


import jwt = require('jsonwebtoken');
import { Router, Request, Response } from "express";
import { AuthorizationRouter } from "./authorization";
import { Authentication } from '../core/authentication/authentication';
export class AuthenticationRouter {
    private router: Router = Router();

    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();

        this.router.post("/signupwithusernameandpassword", authorizationRouter.checkPermission, function (request: Request, response: Response) {
            authentication.signUpWithUsernameAndPassword(request.body.username, request.body.password, function (err, code, data) {
                response.statusCode = code;
                if (err) {
                    response.json(err);
                } else if (data) {
                    response.json(data);
                }
            });
        });

        this.router.post("/signinwithusernameandpassword", authorizationRouter.checkPermission, function (request: Request, response: Response) {
            authentication.signInWithUsernameAndPassword(request.body.username, request.body.password, function (err, code, data) {
                response.statusCode = code;
                if (err) {
                    response.json(err);
                } else if (data) {
                    response.json(data);
                }
            });
        });

        return this.router;

    }
}


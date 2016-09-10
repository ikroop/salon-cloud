/*
 * GET users listing.
 */


import jwt = require('jsonwebtoken');
import { Router, Request, Response } from "express";
import { AuthenticationRouter } from "./authentication";
import { Authorization } from '../core/authorization/authorization';
export class AuthorizationRouter {
    private router: Router = Router();
    private authorization: Authorization = new Authorization();
    private authenticationRouter: AuthenticationRouter = new AuthenticationRouter();
    getRouter(): Router {

        this.router.post("/signupwithusernameandpassword", this.authenticationRouter.checkPermission, function (request: Request, response: Response) {
            this.authorization.signUpWithUsernameAndPassword(request.body.username, request.body.password, function (err, code, data) {
                response.statusCode = code;
                if (err) {
                    response.json(err);
                } else if (data) {
                    response.json(data);
                }
            });
        });

        this.router.post("/signinwithusernameandpassword", this.authenticationRouter.checkPermission, function (request: Request, response: Response) {
            var auth = new Authorization();
            this.authorization.signInWithUsernameAndPassword(request.body.username, request.body.password, function (err, code, data) {
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


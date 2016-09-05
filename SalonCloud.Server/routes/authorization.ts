/*
 * GET users listing.
 */


import jwt = require('jsonwebtoken');
import { Router, Request, Response } from "express";

import { Authorization } from '../core/authorization/authorization';
export class AuthorizationRouter {
    private router: Router = Router();
    private auth = new Authorization();

    getRouter(): Router {

        this.router.post("/signupwithusernameandpassword", async (request: Request, response: Response) => {
            this.auth.signUpWithUsernameAndPassword(request.body.username, request.body.password, function(err, code, data){
                response.statusCode = code;
                if (err){
                    response.json(err);
                }else if (data){
                    response.json(data);
                }
            });
        });

        this.router.post("/signinwithusernameandpassword", async (request: Request, response: Response) => {
            var auth = new Authorization();
            this.auth.signInWithUsernameAndPassword(request.body.username, request.body.password, function(err, code, data){
                response.statusCode = code;
                if (err){
                    response.json(err);
                }else if (data){
                    response.json(data);
                }
            });
        });

        return this.router;

    }
}


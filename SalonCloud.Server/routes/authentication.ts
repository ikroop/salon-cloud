/*
 * GET users listing.
 */


import jwt = require('jsonwebtoken');
import { Router, Request, Response } from "express";
import { AuthorizationRouter } from "./authorization";
import { Authentication } from './../core/authentication/authentication';
import { SalonCloudResponse } from "./../core/SalonCloudResponse";

export class AuthenticationRouter {
    private router: Router = Router();

    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();

        this.router.post("/signupwithusernameandpassword", authorizationRouter.checkPermission, async(request: Request, response: Response) => {    
            //TODO: have to use Anonymouse class
            let result = await authentication.signUpWithUsernameAndPassword(request.body.username, request.body.password);
            response.statusCode = result.code;
            if(result.err){
                response.json(result.err);
            }else{
                response.json(result.data);
            }
        });

        this.router.post("/signinwithusernameandpassword", authorizationRouter.checkPermission, async function (request: Request, response: Response) {
            //TODO: have to use Anonymouse class
            let result:any = await authentication.signInWithUsernameAndPassword(request.body.username, request.body.password);
            response.statusCode = result.code;
            if(result.err){
                response.json(result.err);
            }else{
                response.json(result.data);
            }
        });

        return this.router;

    }
}


/*
 * GET users listing.
 */

import { Router, Request, Response } from "express";
import { SalonCloudResponse } from "../core/SalonCloudResponse";
import { Authentication } from '../core/authentication/authentication';
import { Authorization } from "../core/authorization/authorization";
import { AuthorizationRouter } from "./authorization";

export class UserManagementRouter {
    private router: Router = Router();    

    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();
       
        this.router.post("/API-NAME", function (request: Request, response: Response) {

        });
        return this.router;
    }
}


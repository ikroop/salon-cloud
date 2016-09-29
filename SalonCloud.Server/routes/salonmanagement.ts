/*
 * Salon REST API
 */

import { Router, Request, Response } from "express";
import { AuthorizationRouter } from "./authorization";
import { Authentication } from '../core/authentication/authentication';

export class SalonManagementRouter {
    private router: Router = Router();

    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();

        this.router.post("/create", authorizationRouter.checkPermission, function (request: Request, response: Response) {
            
        });

        this.router.post("/getsalonlist", authorizationRouter.checkPermission, function (request: Request, response: Response) {
           
        });

        this.router.post("/updatesettings", authorizationRouter.checkPermission, function (request: Request, response: Response) {
           
        });

        this.router.post("/updateinformation", authorizationRouter.checkPermission, function (request: Request, response: Response) {
           
        });

        return this.router;

    }
}
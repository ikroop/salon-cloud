/*
 * Salon REST API
 */

import { Router, Request, Response } from "express";
import { AuthorizationRouter } from "./authorization";
import { Authentication } from '../core/authentication/authentication';
import {SignedInUser} from '../core/user/SignedInUser';
import {SalonManagement} from '../modules/salonManagement/SalonManagement';
import {UserManagement} from '../modules/userManagement/UserManagement';

export class SalonManagementRouter {
    private router: Router = Router();

    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();

        this.router.post("/create", authorizationRouter.checkPermission, async(request: Request, response: Response) => {
            var userObject = new SignedInUser(new SalonManagement(), new UserManagement(request.user.uid));
            var salonCreation = await userObject.createSalon(request.salonInformation);
            response.status(200).json(salonCreation.data);
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
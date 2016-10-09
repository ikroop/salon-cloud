/*
 * Salon REST API
 */

import { Router, Request, Response } from "express";
import { AuthorizationRouter } from "./authorization";
import { Authentication } from '../core/authentication/authentication';
import {SignedInUser} from '../core/user/SignedInUser';
import {SalonManagement} from '../modules/salonManagement/SalonManagement';
import {UserManagement} from '../modules/userManagement/UserManagement';
import {SalonInformation} from '../modules/salonManagement/SalonData'

export class SalonManagementRouter {
    private router: Router = Router();

    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();

        this.router.post("/create", authorizationRouter.checkPermission, async(request: Request, response: Response) => {
            console.log('in');
            console.log(request.body);
            var userObject = new SignedInUser(new SalonManagement(), new UserManagement('57cce161025fbb84279aa13f'));
            console.log('mid');
            var salonInformationInput : SalonInformation = {
                email: request.body.email,
                phone: {
                    number: request.body.phonenumber,
                    is_verified: false
                },
                location: {
                    address: request.body.address,
                    is_verified: false
                },
                salon_name: request.body.salon_name,
            }
            var salonCreation = await userObject.createSalon(salonInformationInput);
            console.log('out');
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
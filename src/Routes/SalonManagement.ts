﻿/*
 * Salon REST API
 */

import { Router, Request, Response } from 'express';
import { AuthorizationRouter } from './Authorization';
import { Authentication } from './../Core/Authentication/Authentication';
import { SignedInUser } from './../Core/User/SignedInUser';
import { SalonManagement } from './../Modules/SalonManagement/SalonManagement';
import { UserManagement } from './../Modules/UserManagement/UserManagement';
import { SalonInformation } from './../Modules/SalonManagement/SalonData'

export class SalonManagementRouter {
    private router: Router = Router();

    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();

        this.router.post('/create', authorizationRouter.checkPermission, async (request: Request, response: Response) => {
            var signedUser = new SignedInUser(request.user._id, new SalonManagement(undefined));//Todo
            var salonInformationInput: SalonInformation = {
                email: request.body.email,
                phone: {
                    number: request.body.phonenumber,
                    is_verified: false
                },
                location: {
                    address: request.body.address,
                    is_verified: false,
                    timezone_id: undefined
                },
                salon_name: request.body.salon_name,
            }

            var salonCreation = await signedUser.createSalon(salonInformationInput);
            var dataReturn;
            if (salonCreation.err) {
                dataReturn = {
                    'err': salonCreation.err,
                }
            } else {
                dataReturn = {
                    'uid': salonCreation.data.uid,
                    'salon_id': salonCreation.data.salon_id,
                    'role': salonCreation.data.role,
                    'default_schedule': salonCreation.data.default_schedule,
                    'sample_services': salonCreation.data.sample_services,
                    'salon_data': salonCreation.data.salon_data,
                }
            }
            response.status(salonCreation.code);
            response.json(dataReturn);
        });

        this.router.post('/getsalonlist', authorizationRouter.checkPermission, function (request: Request, response: Response) {

        });

        this.router.post('/updatesettings', authorizationRouter.checkPermission, function (request: Request, response: Response) {

        });

        this.router.post('/updateinformation', authorizationRouter.checkPermission, function (request: Request, response: Response) {

        });

        return this.router;

    }
}
/*
 * GET users listing.
 */

import { Router, Request, Response } from 'express';
import { SalonCloudResponse } from './../Core/SalonCloudResponse';
import { Authentication } from '../Core/Authentication/Authentication';
import { Authorization } from './../Core/Authorization/Authorization';
import { AuthorizationRouter } from './Authorization';
import { AdministratorBehavior } from './../Core/User/AdministratorBehavior';
import {AbstractAdministrator} from './../Core/User/AbstractAdministrator'
import { AppointmentData } from './../Modules/AppointmentManagement/AppointmentData';
import { UserFactory } from './../Core/User/UserFactory';

export class AppointmentManagementRouter {
    private router: Router = Router();    

    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();
       
        this.router.post('/createbyphone', authorizationRouter.checkPermission, async function (request: Request, response: Response) {
            var admin: AdministratorBehavior;
            console.log(request.user);
            // User Factory get Owner or Manager by Id
            // TODO
            admin = UserFactory.createAdminUserObject(request.user._id, request.body.salon_id, 1);

            // Get data for request.body
            var appointment = request.body;
            console.log('out', admin);

            
            // call create appointment function
            var result = await admin.saveAppointment(appointment);

            //return data
            var responseData;
            if(result.err){
                responseData = result.err;
            }else{
                responseData = result.data;
            }
            response.status(result.code).json(responseData);

        });
        return this.router;
    }
}


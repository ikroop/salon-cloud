/*
 * GET users listing.
 */

import { Router, Request, Response } from "express";
import { SalonCloudResponse } from "../core/SalonCloudResponse";
import { Authentication } from '../core/authentication/authentication';
import { Authorization } from "../core/authorization/authorization";
import { AuthorizationRouter } from "./authorization";
import { AdministratorBehavior } from "./../core/user/AdministratorBehavior";
import {AbstractAdministrator} from './../core/user/AbstractAdministrator'
import { AppointmentData } from "./../modules/appointmentManagement/AppointmentData";
import { UserFactory } from './../core/user/UserFactory';

export class AppointmentManagementRouter {
    private router: Router = Router();    

    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();
       
        this.router.post("/bookbyphone", function (request: Request, response: Response) {
            var admin: AdministratorBehavior;

            // User Factory get Owner or Manager by Id
            // TODO
            admin = UserFactory.createAdminUserObject(request.user._id, request.body.salon_id, request.user.role);


            // Get data for request.body
            var appointment = request.body;


            // call create appointment function
            var result = admin.saveAppointment(appointment);

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


/*
 * GET users listing.
 */

import { Router, Request, Response } from "express";
import { SalonCloudResponse } from "./../core/SalonCloudResponse";
import { Authentication } from '../core/authentication/authentication';
import { Authorization } from "./../core/authorization/authorization";
import { AuthorizationRouter } from "./authorization";
import { AdministratorBehavior } from "./../core/user/AdministratorBehavior";
import { AppointmentData } from "./../modules/appointmentManagement/AppointmentData";

export class AppointmentManagementRouter {
    private router: Router = Router();    

    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();
       
        this.router.post("/createbyphone", function (request: Request, response: Response) {
            var admin:AdministratorBehavior;

            // User Factory get Owner or Manager by Id
            // TODO


            // Get data for request.body
            var appointment:AppointmentData;

            // call create appointment function
            admin.saveAppointment(appointment);

            //return data


        });
        return this.router;
    }
}


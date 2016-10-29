/*
 * GET users listing.
 */

import { Router, Request, Response } from "express";
import { SalonCloudResponse } from "./../Core/SalonCloudResponse";
import { Authentication } from '../Core/Authentication/Authentication';
import { Authorization } from "./../Core/Authorization/Authorization";
import { AuthorizationRouter } from "./Authorization";
import { AdministratorBehavior } from "./../Core/User/AdministratorBehavior";
import { AppointmentData } from "./../Modules/AppointmentManagement/AppointmentData";

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


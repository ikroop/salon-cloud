/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { Router, Request, Response } from 'express';
import { SalonCloudResponse } from './../Core/SalonCloudResponse';
import { Authentication } from '../Core/Authentication/Authentication';
import { Authorization } from './../Core/Authorization/Authorization';
import { AuthorizationRouter } from './Authorization';
import { AdministratorBehavior } from './../Core/User/AdministratorBehavior';
import { AbstractAdministrator } from './../Core/User/AbstractAdministrator'
import { AppointmentData, SaveAppointmentData, AppointmentItemData } from './../Modules/AppointmentManagement/AppointmentData';
import { UserFactory } from './../Core/User/UserFactory';
import { SalonTime } from './../Core/SalonTime/SalonTime';
import { ErrorMessage } from './../Core/ErrorMessage'
import { BaseValidator } from './../Core/Validation/BaseValidator'
import { MissingCheck, IsAfterSecondDate, IsValidSalonId } from './../Core/Validation/ValidationDecorators'
import { RestfulResponseAdapter } from './../Core/RestfulResponseAdapter';

export class AppointmentManagementRouter {
    private router: Router = Router();

    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();

        this.router.post('/createbyphone', authorizationRouter.checkPermission, async function (request: Request, response: Response) {
            var admin: AdministratorBehavior;
            // User Factory get Owner or Manager by Id
            // TODO
            admin = UserFactory.createAdminUserObject(request.user._id, request.body.salon_id, request.user.role);
            var appointment: SaveAppointmentData = {
                customer_name: request.body.customer_name || null,
                customer_phone: request.body.customer_phone || null,
                salon_id: request.body.salon_id || null,
                services: null,
                note: request.body.note || null
            }

            // Get data for request.body
            if (request.body.services) {
                appointment.services = [];
                for (let eachService of request.body.services) {
                    var salonTime = new SalonTime();

                    appointment.services.push({
                        employee_id: eachService.employee_id || null,
                        start: salonTime.setString(eachService.start) || null,
                        service: {
                            service_id: eachService.service_id || null
                        },
                        overlapped: {
                            status: false,
                        }
                    });
                }
            }


            // call create appointment function
            var result = await admin.saveAppointment(appointment);

            var restfulResponse = new RestfulResponseAdapter(result);
            response.statusCode = 200;
            response.json(restfulResponse.googleRestfulResponse());
        });
        return this.router;
    }
}


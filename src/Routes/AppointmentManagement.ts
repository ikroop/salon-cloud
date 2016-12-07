/*
 * GET users listing.
 */

import { Router, Request, Response } from 'express';
import { SalonCloudResponse } from './../Core/SalonCloudResponse';
import { Authentication } from '../Core/Authentication/Authentication';
import { Authorization } from './../Core/Authorization/Authorization';
import { AuthorizationRouter } from './Authorization';
import { AdministratorBehavior } from './../Core/User/AdministratorBehavior';
import { AbstractAdministrator } from './../Core/User/AbstractAdministrator'
import { AppointmentData } from './../Modules/AppointmentManagement/AppointmentData';
import { UserFactory } from './../Core/User/UserFactory';
import { SalonTime } from './../Core/SalonTime/SalonTime';
import { ErrorMessage } from './../Core/ErrorMessage'
import { BaseValidator } from './../Core/Validation/BaseValidator'
import { IsDateString, MissingCheck, IsAfterSecondDate, IsValidEmployeeId, IsValidSalonId } from './../Core/Validation/ValidationDecorators'


export class AppointmentManagementRouter {
    private router: Router = Router();

    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();

        this.router.post('/createbyphone', authorizationRouter.checkPermission, async function (request: Request, response: Response) {
            var admin: AdministratorBehavior;
            // User Factory get Owner or Manager by Id
            // TODO
            console.log('ONE');
            admin = UserFactory.createAdminUserObject(request.user._id, request.body.salon_id, request.user.role);

            // Get data for request.body
            var appointment = request.body;
            var salonTime = new SalonTime();

            console.log(request.body);
            for (let eachService in appointment.services) {
                let startTimeValidation = new BaseValidator(appointment.services[eachService].start);
                startTimeValidation = new MissingCheck(startTimeValidation, ErrorMessage.MissingStartDate);
                startTimeValidation = new IsDateString(startTimeValidation, ErrorMessage.InvalidDate);
                let startTimeError = await startTimeValidation.validate();

                if (startTimeError) {
                    response.status(400).json({ 'err': startTimeError.err });
                    return;
                }
                appointment.services[eachService].start = salonTime.setString(appointment.services[eachService].start);
                console.log('TEST: ', appointment.services[eachService].start.month, appointment.services[eachService].start.date);
            }
            // call create appointment function
            console.log('TWO', admin, appointment);
            var result = await admin.saveAppointment(appointment);

            console.log('Three', result);
            //return data
            var responseData;
            if (result.err) {
                responseData = result.err;
            } else {
                responseData = result.data;
            }
            response.status(result.code).json(responseData);

        });
        return this.router;
    }
}


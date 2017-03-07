/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import passport = require('passport');
import jwt = require('jsonwebtoken');
import fs = require('fs');
import { Router, Request, Response } from 'express';
import { Schedule } from './../Modules/Schedule/Schedule';
import { SalonSchedule } from './../Modules/Schedule/SalonSchedule';
import { EmployeeSchedule } from './../Modules/Schedule/EmployeeSchedule';
import { AdministratorBehavior } from './../Core/User/AdministratorBehavior';
import { AbstractAdministrator } from './../Core/User/AbstractAdministrator'
import { AppointmentData } from './../Modules/AppointmentManagement/AppointmentData';
import { UserFactory } from './../Core/User/UserFactory';
import { WeeklyScheduleData, DailyScheduleData, IWeeklyScheduleData } from './../Modules/Schedule/ScheduleData'
import { SalonTime } from './../Core/SalonTime/SalonTime'
import { SalonTimeData } from './../Core/SalonTime/SalonTimeData'
import { Authentication } from '../Core/Authentication/Authentication';
import { Authorization } from './../Core/Authorization/Authorization';
import { AuthorizationRouter } from './Authorization';
import { DailyDayData } from './../Modules/Schedule/ScheduleData'
import { ErrorMessage } from './../Core/ErrorMessage'
import { BaseValidator } from './../Core/Validation/BaseValidator'
import { MissingCheck, IsAfterSecondDate, IsValidSalonId } from './../Core/Validation/ValidationDecorators'
import { RestfulResponseAdapter } from './../Core/RestfulResponseAdapter';

export class ScheduleRouter {
    private router: Router = Router();


    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();

        this.router.get('/getsalonweeklyschedule', async (request: Request, response: Response) => {

            let salonId = request.query.salon_id;

            let salonSchedule = new SalonSchedule(salonId);
            let salonWeeklySchedules = await salonSchedule.getWeeklySchedule();

            var restfulResponse = new RestfulResponseAdapter(salonWeeklySchedules);
            response.statusCode = 200;
            response.json(restfulResponse.googleRestfulResponse());


        });

        this.router.get('/getsalondailyschedule', async (request: Request, response: Response) => {
            let salonId = request.query.salon_id;

            let startDate = new SalonTime().setString(request.query.start_date);
            let endDate = new SalonTime().setString(request.query.end_date);

            let salonSchedule = new SalonSchedule(salonId);

            let salonWeeklySchedules = await salonSchedule.getDailySchedule(startDate, endDate);
            var restfulResponse = new RestfulResponseAdapter(salonWeeklySchedules);
            response.statusCode = 200;
            response.json(restfulResponse.googleRestfulResponse());

        });

        this.router.get('/getemployeeweeklyschedule', async (request: Request, response: Response) => {

            let salonId = request.query.salon_id;
            let employeeId = request.query.employee_id;

            let employeeSchedule = new EmployeeSchedule(salonId, employeeId);
            let employeeWeeklySchedules = await employeeSchedule.getWeeklySchedule();
            var restfulResponse = new RestfulResponseAdapter(employeeWeeklySchedules);
            response.statusCode = 200;
            response.json(restfulResponse.googleRestfulResponse());

        });

        this.router.get('/getemployeedailyschedule', async (request: Request, response: Response) => {

            let salonId = request.query.salon_id;
            let employeeId = request.query.employee_id;

            let startDate = new SalonTime().setString(request.query.start_date);
            let endDate = new SalonTime().setString(request.query.end_date);

            let employeeSchedule = new EmployeeSchedule(salonId, employeeId);
            let employeeDailySchedules = await employeeSchedule.getDailySchedule(startDate, endDate);
            var restfulResponse = new RestfulResponseAdapter(employeeDailySchedules);
            response.statusCode = 200;
            response.json(restfulResponse.googleRestfulResponse());

        });

        this.router.post('/savesalonweeklyschedule', authorizationRouter.checkPermission, async (request: Request, response: Response) => {

            var admin: AdministratorBehavior;

            //create appropriate user object using UserFactory;
            admin = UserFactory.createAdminUserObject(request.user._id, request.body.salon_id, request.user.role);
            var weeklySchedule: WeeklyScheduleData = {
                salon_id: request.body.salon_id,
                employee_id: null,
                week: request.body.weekly_schedules
            };

            let result = await admin.updateWeeklySchedule(null, weeklySchedule, new SalonSchedule(request.body.salon_id));

            var restfulResponse = new RestfulResponseAdapter(result);
            response.statusCode = 200;
            response.json(restfulResponse.googleRestfulResponse());


        });

        this.router.post('/savesalondailyschedule', authorizationRouter.checkPermission, async (request: Request, response: Response) => {

            var admin: AdministratorBehavior;

            //create appropriate user object using UserFactory;
            admin = UserFactory.createAdminUserObject(request.user._id, request.body.salon_id, request.user.role);

            //convert date string to salonTimeData;
            var salonTime = new SalonTime();

            request.body.date = salonTime.setString(request.body.date);
            var dailySchedule: DailyScheduleData = {
                salon_id: request.body.salon_id,
                employee_id: null,
                day: {
                    date: request.body.date,
                    status: request.body.status,
                    open: request.body.open,
                    close: request.body.close
                }
            };

            //updateDailySchedule
            let result = await admin.updateDailySchedule(null, dailySchedule, new SalonSchedule(request.body.salon_id));
            var restfulResponse = new RestfulResponseAdapter(result);
            response.statusCode = 200;
            response.json(restfulResponse.googleRestfulResponse());

        });

        this.router.post('/saveemployeeweeklyschedule', authorizationRouter.checkPermission, async (request: Request, response: Response) => {

            var admin: AdministratorBehavior;
            //create appropriate user object using UserFactory;
            admin = UserFactory.createAdminUserObject(request.user._id, request.body.salon_id, request.user.role);
            var employeeId = request.body.employee_id;
            var weeklySchedule: WeeklyScheduleData = {
                salon_id: request.body.salon_id,
                employee_id: request.body.employee_id,
                week: request.body.weekly_schedules
            };

            let result = await admin.updateWeeklySchedule(request.body.employee_id, weeklySchedule, new EmployeeSchedule(request.body.salon_id, employeeId));

            var restfulResponse = new RestfulResponseAdapter(result);
            response.statusCode = 200;
            response.json(restfulResponse.googleRestfulResponse());



        });
        this.router.post('/saveemployeedailyschedule', authorizationRouter.checkPermission, async (request: Request, response: Response) => {

            var admin: AdministratorBehavior;

            //create appropriate user object using UserFactory;
            admin = UserFactory.createAdminUserObject(request.user._id, request.body.salon_id, request.user.role);

            //convert date string to salonTimeData;
            var salonTime = new SalonTime();

            var employeeId = request.body.employee_id;
            request.body.date = salonTime.setString(request.body.date);
            var dailySchedule: DailyScheduleData = {
                salon_id: request.body.salon_id,
                employee_id: request.body.employee_id,
                day: {
                    date: request.body.date,
                    status: request.body.status,
                    open: request.body.open,
                    close: request.body.close
                }
            };


            let result = await admin.updateDailySchedule(request.body.employee_id, dailySchedule, new EmployeeSchedule(request.body.salon_id, employeeId));

            var restfulResponse = new RestfulResponseAdapter(result);
            response.statusCode = 200;
            response.json(restfulResponse.googleRestfulResponse());

        });

        return this.router;
    }
}

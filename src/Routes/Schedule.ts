/*
 * Schedule REST API
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
import { IsDateString, MissingCheck, IsAfterSecondDate, IsValidEmployeeId, IsValidSalonId } from './../Core/Validation/ValidationDecorators'

export class ScheduleRouter {
    private router: Router = Router();


    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();

        this.router.get('/getsalonweeklyschedule', async (request: Request, response: Response) => {

            let salonId = request.query.salon_id;
            let salonIdValidation = new BaseValidator(salonId);
            salonIdValidation = new MissingCheck(salonIdValidation, ErrorMessage.MissingSalonId);
            salonIdValidation = new IsValidSalonId(salonIdValidation, ErrorMessage.SalonNotFound);
            let salonIdError = await salonIdValidation.validate();
            if (salonIdError) {
                response.status(400).json({ 'err': salonIdError.err });
                return;
            }
            let salonSchedule = new SalonSchedule(salonId);
            let salonWeeklySchedules = await salonSchedule.getWeeklySchedule();
            if (salonWeeklySchedules.code === 200) {
                response.status(salonWeeklySchedules.code).json({ 'weekly_schedules': salonWeeklySchedules.data.week });
            } else {
                response.status(salonWeeklySchedules.code).json(salonWeeklySchedules.err);
            }
        });

        this.router.get('/getsalondailyschedule', async (request: Request, response: Response) => {
            let salonId = request.query.salon_id;
            let salonIdValidation = new BaseValidator(salonId);
            salonIdValidation = new MissingCheck(salonIdValidation, ErrorMessage.MissingSalonId);
            salonIdValidation = new IsValidSalonId(salonIdValidation, ErrorMessage.SalonNotFound);
            let salonIdError = await salonIdValidation.validate();
            if (salonIdError) {
                response.status(400).json({ 'err': salonIdError.err });
                return;
            }

            var startDateValidation = new BaseValidator(request.query.start_date);
            startDateValidation = new MissingCheck(startDateValidation, ErrorMessage.MissingStartDate);
            startDateValidation = new IsDateString(startDateValidation, ErrorMessage.InvalidStartDate);
            var startDateError = await startDateValidation.validate();
            if (startDateError) {
                response.status(400).json({ 'err': startDateError.err });
                return;
            }

            var endDateValidation = new BaseValidator(request.query.end_date);
            endDateValidation = new MissingCheck(endDateValidation, ErrorMessage.MissingEndDate);
            endDateValidation = new IsDateString(endDateValidation, ErrorMessage.InvalidEndDate);
            endDateValidation = new IsAfterSecondDate(endDateValidation, ErrorMessage.EndDateIsBeforeStartDate, request.query.start_date);
            var endDateError = await endDateValidation.validate();

            if (endDateError) {
                response.status(400).json({ 'err': endDateError.err });
                return;
            }


            let startDate = new SalonTime().setString(request.query.start_date);
            let endDate = new SalonTime().setString(request.query.end_date);

            let salonSchedule = new SalonSchedule(salonId);

            let salonWeeklySchedules = await salonSchedule.getDailySchedule(startDate, endDate);
            if (salonWeeklySchedules.code === 200) {
                response.status(salonWeeklySchedules.code).json({ 'daily_schedules': salonWeeklySchedules.data.days });
            } else {
                response.status(salonWeeklySchedules.code).json(salonWeeklySchedules.err);
            }
        });

        this.router.get('/getemployeeweeklyschedule', async (request: Request, response: Response) => {

            let salonId = request.query.salon_id;
            let employeeId = request.query.employee_id;

            let salonIdValidation = new BaseValidator(salonId);
            salonIdValidation = new MissingCheck(salonIdValidation, ErrorMessage.MissingSalonId);
            salonIdValidation = new IsValidSalonId(salonIdValidation, ErrorMessage.SalonNotFound);
            let salonIdError = await salonIdValidation.validate();
            if (salonIdError) {
                response.status(400).json({ 'err': salonIdError.err });
                return;
            }

            let employeeIdValidation = new BaseValidator(employeeId);
            employeeIdValidation = new MissingCheck(employeeIdValidation, ErrorMessage.MissingEmployeeId);
            employeeIdValidation = new IsValidEmployeeId(employeeIdValidation, ErrorMessage.EmployeeNotFound, salonId);
            var employeeIdError = await employeeIdValidation.validate();

            if (employeeIdError) {
                response.status(400).json({ 'err': employeeIdError.err });
                return;
            }

            let employeeSchedule = new EmployeeSchedule(salonId, employeeId);
            let employeeWeeklySchedules = await employeeSchedule.getWeeklySchedule();
            if (employeeWeeklySchedules.code === 200) {
                response.status(employeeWeeklySchedules.code).json({ 'weekly_schedules': employeeWeeklySchedules.data.week });
            } else {
                response.status(employeeWeeklySchedules.code).json(employeeWeeklySchedules.err);
            }
        });

        this.router.get('/getemployeedailyschedule', async (request: Request, response: Response) => {

            let salonId = request.query.salon_id;
            let employeeId = request.query.employee_id;

            let salonIdValidation = new BaseValidator(salonId);
            salonIdValidation = new MissingCheck(salonIdValidation, ErrorMessage.MissingSalonId);
            salonIdValidation = new IsValidSalonId(salonIdValidation, ErrorMessage.SalonNotFound);
            let salonIdError = await salonIdValidation.validate();
            if (salonIdError) {
                response.status(400).json({ 'err': salonIdError.err });
                return;
            }

            let startDateValidation = new BaseValidator(request.query.start_date);
            startDateValidation = new MissingCheck(startDateValidation, ErrorMessage.MissingStartDate);
            startDateValidation = new IsDateString(startDateValidation, ErrorMessage.InvalidStartDate);
            let startDateError = await startDateValidation.validate();
            if (startDateError) {
                response.status(400).json({ 'err': startDateError.err });
                return;
            }

            let employeeIdValidation = new BaseValidator(employeeId);
            employeeIdValidation = new MissingCheck(employeeIdValidation, ErrorMessage.MissingEmployeeId);
            employeeIdValidation = new IsValidEmployeeId(employeeIdValidation, ErrorMessage.EmployeeNotFound, salonId);
            let employeeIdError = await employeeIdValidation.validate();
            if (employeeIdError) {
                response.status(400).json({ 'err': employeeIdError.err });
                return;
            }

            var endDateValidation = new BaseValidator(request.query.end_date);
            endDateValidation = new MissingCheck(endDateValidation, ErrorMessage.MissingEndDate);
            endDateValidation = new IsDateString(endDateValidation, ErrorMessage.InvalidEndDate);
            endDateValidation = new IsAfterSecondDate(endDateValidation, ErrorMessage.EndDateIsBeforeStartDate, request.query.start_date);
            var endDateError = await endDateValidation.validate();

            if (endDateError) {
                response.status(400).json({ 'err': endDateError.err });
                return;
            }

            let startDate = new SalonTime().setString(request.query.start_date);
            let endDate = new SalonTime().setString(request.query.end_date);

            let employeeSchedule = new EmployeeSchedule(salonId, employeeId);
            let employeeDailySchedules = await employeeSchedule.getDailySchedule(startDate, endDate);
            if (employeeDailySchedules.code === 200) {
                response.status(employeeDailySchedules.code).json({ 'daily_schedules': employeeDailySchedules.data.days });
            } else {
                response.status(employeeDailySchedules.code).json(employeeDailySchedules.err);
            }
        });

        this.router.post('/savesalonweeklyschedule', authorizationRouter.checkPermission, async (request: Request, response: Response) => {

            var admin: AdministratorBehavior;

            //create appropriate user object using UserFactory;
            admin = UserFactory.createAdminUserObject(request.user._id, request.body.salon_id, request.user.role);
            var weeklySchedule: WeeklyScheduleData = {
                salon_id: request.body.salon_id,
                employee_id: undefined,
                week: request.body.weekly_schedules
            };

            let result = await admin.updateWeeklySchedule(undefined, weeklySchedule);

            var responseData;
            if (result.err) {
                responseData = result.err;
            } else {
                responseData = { '_id': result.data._id };
            }
            response.status(result.code).json(responseData);

        });

        this.router.post('/savesalondailyschedule', authorizationRouter.checkPermission, async (request: Request, response: Response) => {

            var admin: AdministratorBehavior;

            //create appropriate user object using UserFactory;
            admin = UserFactory.createAdminUserObject(request.user._id, request.body.salon_id, request.user.role);

            //convert date string to salonTimeData;
            var salonTime = new SalonTime();

            var dateValidation = new BaseValidator(request.body.date);
            dateValidation = new MissingCheck(dateValidation, ErrorMessage.MissingDate);
            dateValidation = new IsDateString(dateValidation, ErrorMessage.InvalidDate);
            var endDateError = await dateValidation.validate();

            if (endDateError) {
                response.status(400).json({ 'err': endDateError.err });
                return;
            }

            request.body.date = salonTime.setString(request.body.date);
            var dailySchedule: DailyScheduleData = {
                salon_id: request.body.salon_id,
                employee_id: undefined,
                day: {
                    date: request.body.date,
                    status: request.body.status,
                    open: request.body.open,
                    close: request.body.close
                }
            };


            //updateDailySchedule
            let result = await admin.updateDailySchedule(undefined, dailySchedule);
            var responseData;
            if (result.err) {
                responseData = result.err;
            } else {
                responseData = {
                    _id: result.data._id
                }
            }
            response.status(result.code).json(responseData);
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
            let employeeIdValidation = new BaseValidator(employeeId);
            employeeIdValidation = new MissingCheck(employeeIdValidation, ErrorMessage.MissingEmployeeId);
            employeeIdValidation = new IsValidEmployeeId(employeeIdValidation, ErrorMessage.EmployeeNotFound, request.body.salon_id);
            var employeeIdError = await employeeIdValidation.validate();

            if (employeeIdError) {
                response.status(400).json({ 'err': employeeIdError.err });
                return;
            }


            let result = await admin.updateWeeklySchedule(request.body.employee_id, weeklySchedule);

            var responseData;
            if (result.err) {
                responseData = result.err;
            } else {
                responseData = { '_id': result.data._id };
            }
            response.status(result.code).json(responseData);


        });
        this.router.post('/saveemployeedailyschedule', authorizationRouter.checkPermission, async (request: Request, response: Response) => {

            var admin: AdministratorBehavior;

            //create appropriate user object using UserFactory;
            admin = UserFactory.createAdminUserObject(request.user._id, request.body.salon_id, request.user.role);

            //convert date string to salonTimeData;
            var salonTime = new SalonTime();

            // Validation date string
            var dateValidation = new BaseValidator(request.body.date);
            dateValidation = new MissingCheck(dateValidation, ErrorMessage.MissingDate);
            dateValidation = new IsDateString(dateValidation, ErrorMessage.InvalidDate);
            var endDateError = await dateValidation.validate();

            if (endDateError) {
                response.status(400).json({ 'err': endDateError.err });
                return;
            }
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

            let employeeIdValidation = new BaseValidator(employeeId);
            employeeIdValidation = new MissingCheck(employeeIdValidation, ErrorMessage.MissingEmployeeId);
            employeeIdValidation = new IsValidEmployeeId(employeeIdValidation, ErrorMessage.EmployeeNotFound, request.body.salon_id);
            var employeeIdError = await employeeIdValidation.validate();
            if (employeeIdError) {
                response.status(400).json({ 'err': employeeIdError.err });
                return;
            }


            let result = await admin.updateDailySchedule(request.body.employee_id, dailySchedule);

            var responseData;
            if (result.err) {
                responseData = result.err;
            } else {
                responseData = result.data;
            }
            response.status(result.code).json(responseData);

        });
        this.router.post('/testpost', async (request: Request, response: Response) => {
            response.status(200).json({ 'testpost': 'OK' });
        });

        return this.router;
    }
}

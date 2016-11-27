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

export class ScheduleRouter {
    private router: Router = Router();


    getRouter(): Router {
        var authentication = new Authentication();
        var authorizationRouter = new AuthorizationRouter();

        this.router.get('/getsalonweeklyschedule', async (request: Request, response: Response) => {

            let salonId = request.query.salon_id;
            let salonSchedule = new SalonSchedule(salonId);
            let salonWeeklySchedules = await salonSchedule.getWeeklySchedule();
            if (salonWeeklySchedules.code === 200) {
                response.status(salonWeeklySchedules.code).json(salonWeeklySchedules.data);
            } else {
                response.status(salonWeeklySchedules.code).json(salonWeeklySchedules.err);
            }
        });

        this.router.get('/getsalondailyschedule', async (request: Request, response: Response) => {
            console.log('QUery: ', request.query);
            let salonId = request.query.salon_id;
            let startDate = new SalonTime().setString(request.query.start_date);
            let endDate = new SalonTime().setString(request.query.end_date);

            console.log('Start: ', startDate);
            console.log('end: ', endDate);
            let salonSchedule = new SalonSchedule(salonId);
            console.log('Salon: ', salonSchedule);
             
            let salonWeeklySchedules = await salonSchedule.getDailySchedule(startDate, endDate);
            if (salonWeeklySchedules.code === 200) {
                response.status(salonWeeklySchedules.code).json(salonWeeklySchedules.data);
            } else {
                response.status(salonWeeklySchedules.code).json(salonWeeklySchedules.err);
            }
        });

        this.router.post('/savesalonweeklyschedule', authorizationRouter.checkPermission, async (request: Request, response: Response) => {

            var admin: AdministratorBehavior;

            console.log('Body', request.body);
            //create appropriate user object using UserFactory;
            admin = UserFactory.createAdminUserObject(request.user._id, request.body.salon_id, request.user.role);
            var weeklySchedule: WeeklyScheduleData = {
                salon_id: request.body.salon_id,
                employee_id: undefined,
                week: request.body.weekly_schedules
            };

            console.log('Admin', admin);
            let result = await admin.updateWeeklySchedule(undefined, weeklySchedule);

            var responseData;
            if (result.err) {
                responseData = result.err;
            } else {
                responseData = result.data;
            }
            response.status(result.code).json(responseData);

        });

        this.router.post('/savesalondailyschedule', authorizationRouter.checkPermission, async (request: Request, response: Response) => {

            var admin: AdministratorBehavior;
            console.log('Body', request.body);

            //create appropriate user object using UserFactory;
            admin = UserFactory.createAdminUserObject(request.user._id, request.body.salon_id, request.user.role);

            console.log('Admin', admin);

            //convert date string to salonTimeData;
            var salonTime = new SalonTime();
            request.body.daily_schedule.date = salonTime.setString(request.body.daily_schedule.date);

            console.log('date: ', request.body.daily_schedule.date);

            var dailySchedule: DailyScheduleData = {
                salon_id: request.body.salon_id,
                employee_id: undefined,
                day: request.body.daily_schedule
            };


            //updateDailySchedule
            let result = await admin.updateDailySchedule(undefined, dailySchedule);
            console.log('RESULT: ', result);

            var responseData;
            if (result.err) {
                responseData = result.err;
            } else {
                responseData = result.data;
            }

            console.log('Response: ', responseData);
            response.status(result.code).json(responseData);


        });

        this.router.post('/saveemployeeweeklyschedule', authorizationRouter.checkPermission, async (request: Request, response: Response) => {

            var admin: AdministratorBehavior;

            console.log('Admin', admin);


            //create appropriate user object using UserFactory;
            admin = UserFactory.createAdminUserObject(request.user._id, request.body.salon_id, request.user.role);
            var weeklySchedule: WeeklyScheduleData = {
                salon_id: request.body.salon_id,
                employee_id: request.body.employee_id,
                week: request.body.weekly_schedules
            };

            console.log('Admin', admin);
            let result = await admin.updateWeeklySchedule(request.body.employee_id, weeklySchedule);

            var responseData;
            if (result.err) {
                responseData = result.err;
            } else {
                responseData = result.data;
            }
            response.status(result.code).json(responseData);


        });
        this.router.post('/saveemployeedailyschedule', authorizationRouter.checkPermission, async (request: Request, response: Response) => {

            var admin: AdministratorBehavior;

            //create appropriate user object using UserFactory;
            admin = UserFactory.createAdminUserObject(request.user._id, request.body.salon_id, request.user.role);

            //convert date string to salonTimeData;
            var salonTime = new SalonTime();
            request.body.daily_schedule.date = salonTime.setString(request.body.daily_schedule.date);
            console.log('Date: ', request.body.daily_schedule.date);
            var dailySchedule: DailyScheduleData = {
                salon_id: request.body.salon_id,
                employee_id: request.body.employee_id,
                day: request.body.daily_schedule
            };
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

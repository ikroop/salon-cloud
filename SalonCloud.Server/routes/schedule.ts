/*
 * Schedule REST API
 */
import express = require('express');
import passport = require('passport');
import jwt = require('jsonwebtoken');
import fs = require('fs');

import {Validator} from '../core/validator/Validator';
import {SalonSchedule} from '../modules/schedule/SalonScheduleBehavior';
// import {SalonSchedule} from '../modules/schedules/SalonSchedule';
// import {ScheduleProfile} from '../modules/schedules/ScheduleProfile';
// import {DailyScheduleModel} from '../modules/schedules/models/DailyScheduleModel';
// import {WeeklyScheduleModel} from '../modules/schedules/models/WeeklyScheduleModel';

var ErrorMessage = require('./ErrorMessage');

// var Authentication = require('../modules/salon/Salon');


module route {
    export class ScheduleRoute {
        public static getSalonDailySchedule(req: express.Request, res: express.Response) {
         /*
                res.statusCode = 400;
                return res.json(ErrorMessage.SalonNotFound);
            }
            if (!req.params.salon_id) {// TODO: salonId's' not found
                res.statusCode = 400;
                return res.json(ErrorMessage.SalonNotFound);
            }

            if (!req.param.start_date) {
                res.statusCode = 400;
                return res.json(ErrorMessage.MissingStartDate);
            } else {
                if (!Validator.IsValidDate(req.param.start_date)) {
                    res.statusCode = 400;
                    return res.json(ErrorMessage.InvalidStartDate);
                }
            }

            if (!req.param.end_date) {
                res.statusCode = 400;
                return res.json(ErrorMessage.MissingEndDate);
            } else {
                if (!Validator.IsValidDate(req.param.end_date)) {
                    res.statusCode = 400;
                    return res.json(ErrorMessage.InvalidEndDate);
                }
                if (!Validator.IsValidEndDateForStartDate(req.param.end_date, req.param.start_date)) {
                    res.statusCode = 400;
                    return res.json(ErrorMessage.InvalidEndDateForStartDate);
                }
            }
*/
            // TODO: access DB here
            // then return
        }

        public static getEmployeeDailySchedule(req: express.Request, res: express.Response) {
         /*   if (!req.params.employee_id) {
                res.statusCode = 400;
                return res.json(ErrorMessage.EmployeeNotFound);
            }
            if (!req.params.employee_id) {// TODO: employeeId's' not found
                res.statusCode = 400;
                return res.json(ErrorMessage.EmployeeNotFound);
            }

            if (!req.param.start_date) {
                res.statusCode = 400;
                return res.json(ErrorMessage.MissingStartDate);
            } else {
                if (!Validator.IsValidDate(req.param.start_date)) {
                    res.statusCode = 400;
                    return res.json(ErrorMessage.InvalidStartDate);
                }
            }

            if (!req.param.end_date) {
                res.statusCode = 400;
                return res.json(ErrorMessage.MissingEndDate);
            } else {
                if (!Validator.IsValidDate(req.param.end_date)) {
                    res.statusCode = 400;
                    return res.json(ErrorMessage.InvalidEndDate);
                }
                if (!Validator.IsValidEndDateForStartDate(req.param.end_date, req.param.start_date)) {
                    res.statusCode = 400;
                    return res.json(ErrorMessage.InvalidEndDateForStartDate);
                }
            }
*/
            // TODO: access DB here
            // then return
        }

        public static insertSalonWeeklySchedule(req: express.Request, res: express.Response) {
            var insertedSchedule = {
                salon_id: req.body.salon_id,
                status: req.body.status,
                open: req.body.open_time,
                close: req.body.close_time,
                dayofweek: req.body.weekday,
            };
            var salonSchedule = new SalonSchedule();
            salonSchedule.insertWeekly(insertedSchedule, function(err, code, data){
                res.statusCode = code;
                if (err) {
                    return res.json(err);
                } else {
                    return res.json(data);
                }
            });

        }

        public static insertSalonDailySchedule(req: express.Request, res: express.Response) {

            var insertedSchedule = {
                salon_id: req.body.salon_id,
                status: req.body.status,
                open: req.body.open_time,
                close: req.body.close_time,
                date: req.body.date,
            };
        }
    }
}
export = route.ScheduleRoute;
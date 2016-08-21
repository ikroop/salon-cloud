/*
 * Schedule REST API
 */
import express = require('express');
import {Validator} from '../core/validator/Validator';
import {SalonSchedule} from '../modules/schedules/SalonSchedule';
import {ISchedule} from '../modules/schedules/ISchedule';
import {DailyScheduleModel} from '../modules/schedules/models/DailyScheduleModel';
import {WeeklyScheduleModel} from '../modules/schedules/models/WeeklyScheduleModel';

var ErrorMessage = require('./ErrorMessage');

// var Authentication = require('../modules/salon/Salon');


module route {
    export class ScheduleRoute {
        public static GetSalonDailySchedule(req: express.Request, res: express.Response) {
            if (!req.params.salon_id) {
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

            // TODO: access DB here
            // then return
        }
    }
}
export = route.ScheduleRoute;
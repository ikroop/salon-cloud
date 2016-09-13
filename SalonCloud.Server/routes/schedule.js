"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const express_1 = require("express");
const SalonSchedule_1 = require('./../modules/schedule/SalonSchedule');
//import {Validator} from '../core/validator/Validator';
//import {SalonSchedule} from '../modules/schedule/SalonSchedule';
// import {ScheduleProfile} from '../modules/schedules/ScheduleProfile';
//import {DailySchedule} from '../modules/schedule/models/DailySchedule';
//import {DailyScheduleModel} from '../modules/schedule/models/DailyScheduleModel';
//import {WeeklyScheduleData} from '../modules/schedule/ScheduleData';
// import {WeeklyScheduleModel} from '../modules/schedules/models/WeeklyScheduleModel';
//var ErrorMessage = require('./ErrorMessage');
// var Authentication = require('../modules/salon/Salon');
class ScheduleRouter {
    constructor() {
        this.router = express_1.Router();
    }
    getRouter() {
        this.router.post("/saveWeeklySchedule", (request, response) => __awaiter(this, void 0, void 0, function* () {
            let testObject = new SalonSchedule_1.SalonSchedule();
            let test = yield testObject.saveWeeklySchedule(request.body.salon_id, request.body.weekly_schedules);
            response.status(200).json(test);
        }));
        this.router.post("/saveDailySchedule", (request, response) => __awaiter(this, void 0, void 0, function* () {
            console.log('testk');
            let testObject = new SalonSchedule_1.SalonSchedule();
            console.log('test');
            let test = yield testObject.saveDailySchedule(request.body.salon_id, request.body.daily_schedules);
            console.log('test', test);
            response.status(200).json(test);
        }));
        this.router.post("/testpost", (request, response) => __awaiter(this, void 0, void 0, function* () {
            response.status(200).json({ "testpost": "OK" });
        }));
        return this.router;
    }
}
exports.ScheduleRouter = ScheduleRouter;
/*export class ScheduleRoute {
    public static getSalonDailySchedule(req: express.Request, res: express.Response) {
        
               res.statusCode = 400;
               return res.json(ErrorMe
               ssage.SalonNotFound);
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
        var salonScheduleBehavior = new SalonSchedule();
        var startDate = new Date();
        var endDate = startDate;
        salonScheduleBehavior.getSchedule(startDate, endDate, function (err, code, data) {
            res.statusCode = code;
            if (err) {
                return res.json(err);
            } else {
                return res.json(data);
            }
        });


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

        // TODO: access DB here
        // then return
    }

    public static insertSalonWeeklySchedule(req: express.Request, res: express.Response) {
        // var insertedSchedule = {
        //     salon_id: req.body.salon_id,
        //     status: req.body.status,
        //     open: req.body.open_time,
        //     close: req.body.close_time,
        //     dayofweek: req.body.weekday,
        // };
        var insertedSchedule: Array<WeeklyScheduleData> = [];
        for (var i = 0; i < req.body.weekly_schedules.length; i++) {
            var obj = {
                _id: req.body.weekly_schedules[i].day_of_week,
                close: req.body.weekly_schedules[i].close,
                open: req.body.weekly_schedules[i].open,
                status: req.body.weekly_schedules[i].status,
                day_of_week: req.body.weekly_schedules[i].day_of_week
            };
            insertedSchedule.push(obj);
        }
        var salonSchedule = new SalonSchedule();
        salonSchedule.insertWeekly(req.body.salon_id, insertedSchedule, function (err, code, data) {
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
}*/
//# sourceMappingURL=schedule.js.map
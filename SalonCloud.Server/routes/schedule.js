"use strict";
const SalonScheduleBehavior_1 = require('../modules/schedule/SalonScheduleBehavior');
const WeeklySchedule_1 = require('../modules/schedule/models/WeeklySchedule');
// import {WeeklyScheduleModel} from '../modules/schedules/models/WeeklyScheduleModel';
var ErrorMessage = require('./ErrorMessage');
// var Authentication = require('../modules/salon/Salon');
var route;
(function (route) {
    class ScheduleRoute {
        static getSalonDailySchedule(req, res) {
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
            var salonScheduleBehavior = new SalonScheduleBehavior_1.SalonSchedule();
            var startDate = new Date();
            var endDate = startDate;
            salonScheduleBehavior.getSchedule(startDate, endDate, function (err, code, data) {
                res.statusCode = code;
                if (err) {
                    return res.json(err);
                }
                else {
                    return res.json(data);
                }
            });
        }
        static getEmployeeDailySchedule(req, res) {
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
        static insertSalonWeeklySchedule(req, res) {
            // var insertedSchedule = {
            //     salon_id: req.body.salon_id,
            //     status: req.body.status,
            //     open: req.body.open_time,
            //     close: req.body.close_time,
            //     dayofweek: req.body.weekday,
            // };
            let insertedSchedule = new WeeklySchedule_1.WeeklySchedule(undefined, req.body.salon_id, req.body.open_time, req.body.close_time, req.body.status, req.body.weekday);
            var salonSchedule = new SalonScheduleBehavior_1.SalonSchedule();
            salonSchedule.insertWeekly(insertedSchedule, function (err, code, data) {
                res.statusCode = code;
                if (err) {
                    return res.json(err);
                }
                else {
                    return res.json(data);
                }
            });
        }
        static insertSalonDailySchedule(req, res) {
            var insertedSchedule = {
                salon_id: req.body.salon_id,
                status: req.body.status,
                open: req.body.open_time,
                close: req.body.close_time,
                date: req.body.date,
            };
        }
    }
    route.ScheduleRoute = ScheduleRoute;
})(route || (route = {}));
module.exports = route.ScheduleRoute;
//# sourceMappingURL=schedule.js.map
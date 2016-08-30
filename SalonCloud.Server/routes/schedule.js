"use strict";
const SalonSchedule_1 = require('../modules/schedule/SalonSchedule');
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
            var salonScheduleBehavior = new SalonSchedule_1.SalonSchedule();
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
            var insertedSchedule = [];
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
            var salonSchedule = new SalonSchedule_1.SalonSchedule();
            salonSchedule.insertWeekly(req.body.salon_id, insertedSchedule, function (err, code, data) {
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
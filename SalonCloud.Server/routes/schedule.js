"use strict";
var Validator_1 = require('../core/validator/Validator');
var ErrorMessage = require('./ErrorMessage');
// var Authentication = require('../modules/salon/Salon');
var route;
(function (route) {
    var ScheduleRoute = (function () {
        function ScheduleRoute() {
        }
        ScheduleRoute.GetSalonDailySchedule = function (req, res) {
            if (!req.params.salon_id) {
                res.statusCode = 400;
                return res.json(ErrorMessage.SalonNotFound);
            }
            if (!req.params.salon_id) {
                res.statusCode = 400;
                return res.json(ErrorMessage.SalonNotFound);
            }
            if (!req.param.start_date) {
                res.statusCode = 400;
                return res.json(ErrorMessage.MissingStartDate);
            }
            else {
                if (!Validator_1.Validator.IsValidDate(req.param.start_date)) {
                    res.statusCode = 400;
                    return res.json(ErrorMessage.InvalidStartDate);
                }
            }
            if (!req.param.end_date) {
                res.statusCode = 400;
                return res.json(ErrorMessage.MissingEndDate);
            }
            else {
                if (!Validator_1.Validator.IsValidDate(req.param.end_date)) {
                    res.statusCode = 400;
                    return res.json(ErrorMessage.InvalidEndDate);
                }
                if (!Validator_1.Validator.IsValidEndDateForStartDate(req.param.end_date, req.param.start_date)) {
                    res.statusCode = 400;
                    return res.json(ErrorMessage.InvalidEndDateForStartDate);
                }
            }
            // TODO: access DB here
            // then return
        };
        return ScheduleRoute;
    }());
    route.ScheduleRoute = ScheduleRoute;
})(route || (route = {}));
module.exports = route.ScheduleRoute;

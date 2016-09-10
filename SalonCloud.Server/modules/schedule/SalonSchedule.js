/**
 *
 *
 */
"use strict";
<<<<<<< HEAD
//import {Schedule} from './models/Schedule';
//import {DailyScheduleModel} from './models/DailyScheduleModel';
const ScheduleModel_1 = require('./ScheduleModel');
const mongoose = require("mongoose");
var ErrorMessage = require('./../../routes/ErrorMessage');
var Validator = require('./../../core/validator/Validator');
exports.WeeklyScheduleSchema = new mongoose.Schema({
    salon_id: { type: String, required: true },
    close: { type: Number, required: true },
    open: { type: Number, required: true },
    status: { type: Boolean, required: true },
    dayofweek: { type: Number, required: true },
});
class SalonSchedule {
    /**
     * name
     */
    constructor() {
    }
    ;
    getSchedule(startDate, endDate, callback) {
        if (startDate == null) {
            callback(ErrorMessage.MissingStartDate, 400, undefined);
            return null;
        }
        if (Validator.IsValidDate(startDate) == false) {
            callback(ErrorMessage.InvalidStartDate, 400, undefined);
            return null;
        }
        if (endDate == null) {
            callback(ErrorMessage.MissingEndDate, 400, undefined);
            return null;
        }
        if (Validator.IsValidDate(endDate) == false) {
            callback(ErrorMessage.InvalidEndDate, 400, undefined);
            return null;
        }
        if (startDate.getTime() > endDate.getTime()) {
            callback(ErrorMessage.InvalidEndDateForStartDate, 400, undefined);
            return null;
        }
        let dateRangeCondition = { date: { $gte: startDate, $lt: endDate } };
        ScheduleModel_1.DailyScheduleModel.find(dateRangeCondition, function (err, dailySchedules) {
            if (err) {
                // ToDo: throw error
                callback(ErrorMessage.ServerError, 500, undefined);
                return null;
            }
            return dailySchedules;
        });
        return undefined;
=======
const Schedule_1 = require("./Schedule");
class SalonSchedule extends Schedule_1.Schedule {
    addDailySchedule(dailySchedule) {
        return false;
    }
    addWeeklySchedule(weeklyScheduleList) {
        return true;
>>>>>>> origin/master
    }
    checkDailySchedule(dailySchedule) {
        return false;
    }
    checkWeeklySchedule(salonId) {
        return true;
    }
    getDailyScheduleRecord(date) {
        var dailySchedule;
        return dailySchedule;
    }
    getWeeklyScheduleRecord() {
        var weeklyScheduleList;
        return weeklyScheduleList;
    }
    normalizeDailySchedule(dailySchedule) {
        return dailySchedule;
    }
    updateDailySchedule(dailySchedule) {
        return false;
    }
    updateWeeklySchedule(weeklyScheduleList) {
        return true;
    }
}
exports.SalonSchedule = SalonSchedule;
//# sourceMappingURL=SalonSchedule.js.map
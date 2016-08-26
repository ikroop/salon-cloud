"use strict";
const DailyScheduleModel_1 = require('./models/DailyScheduleModel');
const WeeklyScheduleModel_1 = require('./models/WeeklyScheduleModel');
const mongoose = require("mongoose");
var ErrorMessage = require('./../../routes/ErrorMessage');
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
    getSchedule(startDate, endDate) {
        DailyScheduleModel_1.DailyScheduleModel.create;
        return undefined;
    }
    /**
     * name
     */
    getWeeklySchedule() {
        return undefined;
    }
    /**
     * name
     */
    insertWeekly(schedule, callback) {
        WeeklyScheduleModel_1.WeeklyScheduleModel.create(schedule, function (err, salonSchedule) {
            if (err) {
                callback(ErrorMessage.ServerError, 500, undefined);
            }
            else {
                console.log('why not?');
                callback(undefined, 200, salonSchedule);
            }
        });
    }
    /**
     * name
     */
    insertDaily(schedule) {
    }
    /**
     * name
     */
    validate(schedule) {
    }
}
exports.SalonSchedule = SalonSchedule;
//# sourceMappingURL=SalonScheduleBehavior.js.map
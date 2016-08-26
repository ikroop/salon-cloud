"use strict";
const ScheduleBehavior_1 = require('./ScheduleBehavior');
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
class SalonSchedule extends ScheduleBehavior_1.ScheduleBehavior {
    /**
     * name
     */
    getSchedule(startDate, endDate, callback) {
        // DailyScheduleModel.
        // Bear.findById(req.params.bear_id, function(err, bear) {
        //     if (err)
        //         res.send(err);
        //     res.json(bear);
        // });
        DailyScheduleModel_1.DailyScheduleModel.create();
        return undefined;
    }
    /**
     * name
     */
    getWeeklySchedule(callback) {
        return undefined;
    }
    /**
     * name
     */
    insertWeekly(schedule, callback) {
        let weeklyScheduleProfile = schedule.exportProfile();
        WeeklyScheduleModel_1.WeeklyScheduleModel.create(weeklyScheduleProfile, function (err, salonSchedule) {
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
    insertDaily(schedule, callback) {
    }
    /**
     * name
     */
    validate(schedule, callback) {
    }
}
exports.SalonSchedule = SalonSchedule;
//# sourceMappingURL=SalonScheduleBehavior.js.map
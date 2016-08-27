"use strict";
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
    getSchedule(startDate, endDate, callback) {
        // DailyScheduleModel.
        // Bear.findById(req.params.bear_id, function(err, bear) {
        //     if (err)
        //         res.send(err);
        //     res.json(bear);
        // });
        //COMMENTED BY DUE NGUYEN
        //DailyScheduleModel.create()
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
        //COMMENTED BY DUE NGUYENS
        /*let weeklyScheduleProfile = schedule.exportProfile() as WeeklyScheduleProfile;
        WeeklyScheduleModel.create(weeklyScheduleProfile, function(err: any, salonSchedule: WeeklyScheduleProfile){
            if (err) {
                callback(ErrorMessage.ServerError, 500, undefined);
            } else {
                console.log('why not?');
                callback(undefined, 200, salonSchedule);
            }
        });*/
    }
    /**
     * name
     */
    insertDaily(schedule, callback) {
    }
}
exports.SalonSchedule = SalonSchedule;
//# sourceMappingURL=SalonSchedule.js.map
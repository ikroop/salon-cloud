"use strict";
//import {Schedule} from './models/Schedule';
//import {DailyScheduleModel} from './models/DailyScheduleModel';
const ScheduleModel_1 = require('./ScheduleModel');
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
    ;
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
    insertWeekly(salonId, schedule, callback) {
        ScheduleModel_1.ScheduleModel.findOne({ "_id": salonId }, function (err, docs) {
            if (err) {
                console.log(err);
                callback(ErrorMessage.ServerError, 500, undefined);
            }
            else if (!docs) {
                //ToDo: create default Schedule Docs for Salon
                var newSchedule = {
                    _id: salonId,
                    // employee_id: {type: String, required: true},
                    // created_date: {type: Date, required: true},
                    // last_modified: {type: Date, required: true},
                    // created_by: {type: UserProfileSchema, required: true},
                    salon: {
                        weekly: [{
                                _id: schedule.day_of_week,
                                close: schedule.close,
                                open: schedule.open,
                                status: schedule.status,
                                day_of_week: schedule.day_of_week
                            }],
                        daily: undefined
                    },
                    employee: undefined
                };
                ScheduleModel_1.ScheduleModel.create(newSchedule, function (err, newSchedule) {
                    if (err) {
                        callback(ErrorMessage.ServerError, 500, undefined);
                    }
                    else {
                        callback(undefined, 200, schedule);
                    }
                });
            }
            else {
                var item = docs.salon.weekly.id(schedule.day_of_week);
                console.log('BOOOOOOOOBBB ' + item);
                var targetSchedule = docs.salon.weekly.filter(function (x) {
                    return x._id == schedule.day_of_week;
                });
                /*if(targetSchedule.length == 0){
                    docs.salon.weekly.push(schedule);
                }else{

                }*/
                console.log('CAAAAAAAAACCC' + targetSchedule);
            }
        });
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
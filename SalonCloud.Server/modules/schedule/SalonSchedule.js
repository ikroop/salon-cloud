"use strict";
//import {Schedule} from './models/Schedule';
//import {DailyScheduleModel} from './models/DailyScheduleModel';
const ScheduleModel_1 = require('./ScheduleModel');
const mongoose = require("mongoose");
const validator_1 = require('./../../core/validator/validator');
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
    insertWeekly(salonId, schedules, callback) {
        if (!salonId) {
            callback(ErrorMessage.MissingSalonId, 400, undefined);
            console.log(7);
            return;
        }
        if (schedules.length != 7) {
            callback(ErrorMessage.WrongNumberOfDaysOfWeek, 400, undefined);
            console.log(6);
            return;
        }
        var duplicateCheckList = [];
        for (var i = 0; i <= 6; i++) {
            if (duplicateCheckList.indexOf(schedules[i]._id) != -1) {
                callback(ErrorMessage.DuplicateDaysOfWeek, 400, undefined);
                console.log(1);
                return;
            }
            else {
                duplicateCheckList.push(schedules[i]._id);
            }
            if (schedules[i].status == undefined) {
                callback(ErrorMessage.MissingScheduleStatus, 400, undefined);
                console.log(2);
                return;
            }
            if (schedules[i].open == undefined) {
                callback(ErrorMessage.MissingScheduleOpenTime, 400, undefined);
                console.log(3);
                return;
            }
            if (schedules[i].close == undefined) {
                callback(ErrorMessage.MissingScheduleCloseTime, 400, undefined);
                console.log(4);
                return;
            }
            if (schedules[i].day_of_week == undefined) {
                console.log(schedules[i]);
                callback(ErrorMessage.MissingScheduleDayOfWeek, 400, undefined);
                console.log(5);
                return;
            }
            if (!validator_1.Validator.IsValidWeekDay(schedules[i].day_of_week)) {
                callback(ErrorMessage.InvalidScheduleDayOfWeek, 400, undefined);
                return;
            }
            if (!validator_1.Validator.IsValidScheduleTime(schedules[i].open)) {
                callback(ErrorMessage.InvalidScheduleOpenTime, 400, undefined);
                return;
            }
            if (!validator_1.Validator.IsValidScheduleTime(schedules[i].close)) {
                callback(ErrorMessage.InvalidScheduleCloseTime, 400, undefined);
                return;
            }
            if (!validator_1.Validator.IsValidCloseTimeForOpenTime(schedules[i].open, schedules[i].close)) {
                callback(ErrorMessage.CloseTimeGreaterThanOpenTime, 400, undefined);
                return;
            }
        }
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
                        weekly: schedules,
                        daily: undefined
                    },
                    employee: undefined
                };
                ScheduleModel_1.ScheduleModel.create(newSchedule, function (err, newSchedule) {
                    if (err) {
                        callback(ErrorMessage.ServerError, 500, undefined);
                        return;
                    }
                    else {
                        callback(undefined, 200, schedules);
                        return;
                    }
                });
            }
            else {
                console.log('KKKKKK' + docs.salon.weekly[0]);
                console.log('HHHHHHH' + schedules[0]);
                docs.salon.weekly = schedules;
                /*for(var i=0; i<=6; i++){
                    docs.salon.weekly[i] = schedules[i];
                }*/
                console.log('HHHHHHHOOOOOO' + schedules[0]);
                console.log('KKKKKKOOOOO' + docs.salon.weekly[0]);
                docs.save(function (err) {
                    if (err) {
                        callback(err, 500, undefined);
                        return;
                    }
                    else {
                        callback(undefined, 200, schedules);
                        return;
                    }
                });
            }
        });
    }
    /**
     * name
     */
    insertDaily(schedule, callback) {
    }
}
exports.SalonSchedule = SalonSchedule;
//# sourceMappingURL=SalonSchedule.js.map
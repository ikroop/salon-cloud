"use strict";
const ScheduleModel_1 = require("./ScheduleModel");
var ErrorMessage = require('./../../routes/ErrorMessage');
class Schedule {
    /**
     * getDailySchedule
     *
     */
    getDailySchedule(date) {
        var response;
        //TODO: implement validation
        var dailySchedule = this.getDailyScheduleRecord(date);
        if (!dailySchedule) {
            var weeklySchedule = this.getWeeklyScheduleRecord();
        }
        if (dailySchedule) {
            dailySchedule = this.normalizeDailySchedule(dailySchedule);
            response.err = undefined;
            response.data = dailySchedule;
            response.code = 200;
        }
        else {
            response.err = ErrorMessage.ServerError;
            response.data = undefined;
            response.code = 500;
        }
        return response;
    }
    /**
      * name
      */
    getWeeklySchedule() {
        var response;
        //TODO: implement validation
        var weeklySchedule = this.getWeeklyScheduleRecord();
        if (weeklySchedule) {
            response.err = undefined;
            response.code = 200;
            response.data = weeklySchedule;
        }
        else {
            response.err = ErrorMessage.ServerError;
            response.code = 500;
            response.data = undefined;
        }
        return response;
    }
    /**
    *
    */
    getMonthlySchedule(month, year) {
        var response;
        //TODO: use getDailyScheduleRecord(date)
        return response;
    }
    /**
     * name
     */
    saveWeeklySchedule(weeklyScheduleList, callback) {
        var response;
        var saveStatus;
        //TODO: implement validation
        /*if (this.checkWeeklySchedule(weeklyScheduleList[1]._id)) {
            saveStatus = this.updateWeeklySchedule(weeklyScheduleList);
        } else {
            saveStatus = this.addWeeklySchedule(weeklyScheduleList);
        }
        response.data = saveStatus;
        if (saveStatus){
            response.code = 200;
            response.err = undefined;
        }else{
            response.code = 500;
            response.err = ErrorMessage.ServerError;
        }
        

        return response;
        */
        this.checkWeeklySchedule(weeklyScheduleList[1]._id, function (error, data) {
            if (error) {
                callback(error, 500, undefined);
                return;
            }
            else if (data == true) {
                this.updateWeeklySchedule(weeklyScheduleList, function (error, returnData) {
                    if (error) {
                        callback(error, 500, undefined);
                        return;
                    }
                    else {
                        callback(undefined, 200, returnData);
                        return;
                    }
                });
            }
            else {
                this.addWeeklySchedule(weeklyScheduleList, function (error, returnData) {
                    if (error) {
                        callback(error, 500, undefined);
                        return;
                    }
                    else {
                        callback(undefined, 200, returnData);
                        return;
                    }
                });
            }
        });
    }
    /**
     * name
     */
    saveDailySchedule(dailySchedule) {
        var response;
        var saveStatus;
        //TODO: implement validation
        if (this.checkDailySchedule(dailySchedule)) {
            saveStatus = this.updateDailySchedule(dailySchedule);
        }
        else {
            saveStatus = this.addDailySchedule(dailySchedule);
        }
        response.data = saveStatus;
        if (saveStatus) {
            response.code = 200;
            response.err = undefined;
        }
        else {
            response.code = 500;
            response.err = ErrorMessage.ServerError;
        }
        return response;
    }
    checkScheduleDocsExistence(salonId, callback) {
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
                        weekly: undefined,
                        daily: undefined
                    },
                    employee: undefined
                };
                ScheduleModel_1.ScheduleModel.create(newSchedule, function (err, newSchedule) {
                    if (err) {
                        callback(ErrorMessage.ServerError, undefined);
                        return;
                    }
                    else {
                        callback(undefined, newSchedule);
                        return;
                    }
                });
            }
            else {
                callback(undefined, docs);
                return;
            }
        });
    }
}
exports.Schedule = Schedule;
//# sourceMappingURL=Schedule.js.map
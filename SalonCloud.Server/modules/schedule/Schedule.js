"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const ScheduleModel_1 = require("./ScheduleModel");
var ErrorMessage = require('./../../core/ErrorMessage');
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
    saveWeeklySchedule(salonId, weeklyScheduleList) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = {
                code: null,
                data: null,
                err: null
            };
            var saveStatus;
            /*var test = await this.checkWeeklySchedule(salonId);
            console.log('test', test);
            return test;
            */
            //TODO: implement validation
            var k = yield this.checkWeeklySchedule(salonId);
            if (k.err) {
                console.log('taoloa');
                saveStatus = undefined;
            }
            else {
                if (k.data) {
                    console.log('1');
                    saveStatus = yield this.updateWeeklySchedule(salonId, weeklyScheduleList);
                    console.log('k', saveStatus);
                }
                else {
                    console.log('ki');
                    saveStatus = yield this.addWeeklySchedule(salonId, weeklyScheduleList);
                }
            }
            response.data = saveStatus.data;
            if (!saveStatus.err) {
                response.code = 200;
                response.err = undefined;
            }
            else {
                response.code = 500;
                response.err = ErrorMessage.ServerError;
            }
            return response;
            /*this.checkWeeklySchedule(weeklyScheduleList[1]._id, function(error, data){
                if(error){
                    callback(error, 500, undefined);
                    return;
                }else if(data==true){
                    this.updateWeeklySchedule(weeklyScheduleList, function(error, returnData){
                        if(error){
                            callback(error, 500, undefined);
                            return;
                        }else{
                            callback(undefined, 200, returnData);
                            return;
                        }
                    });
                }else{
                    this.addWeeklySchedule(weeklyScheduleList, function(error, returnData){
                        if(error){
                            callback(error, 500, undefined);
                            return;
                        }else{
                            callback(undefined, 200, returnData);
                            return;
                        }
                    });
                }
            })*/
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
        console.log(saveStatus);
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
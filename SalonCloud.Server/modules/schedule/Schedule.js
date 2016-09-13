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
const BaseValidator_1 = require("./../../core/validation/BaseValidator");
const ValidationDecorators_1 = require("./../../core/validation/ValidationDecorators");
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
                code: undefined,
                data: undefined,
                err: undefined
            };
            console.log(salonId, weeklyScheduleList);
            var saveStatus;
            //TODO: implement validation
            var salonIdValidator = new BaseValidator_1.BaseValidator(salonId);
            salonIdValidator = new ValidationDecorators_1.MissingCheck(salonIdValidator, ErrorMessage.MissingSalonId);
            salonIdValidator = new ValidationDecorators_1.IsString(salonIdValidator, ErrorMessage.InvalidSalonId);
            //TODO: validate salon Id;
            salonIdValidator = new ValidationDecorators_1.IsValidSalonId(salonIdValidator, ErrorMessage.InvalidSalonId);
            var salonIdResult = yield salonIdValidator.validate();
            if (salonIdResult) {
                console.log('1', salonIdResult);
                response.err = salonIdResult;
                response.code = 400;
                return response;
            }
            var tempArray = [];
            for (let i = 0; i <= 6; i++) {
                var openTimeValidator = new BaseValidator_1.BaseValidator(weeklyScheduleList[i].open);
                openTimeValidator = new ValidationDecorators_1.MissingCheck(openTimeValidator, ErrorMessage.MissingScheduleOpenTime);
                openTimeValidator = new ValidationDecorators_1.IsNumber(openTimeValidator, ErrorMessage.InvalidScheduleOpenTime);
                openTimeValidator = new ValidationDecorators_1.IsInRange(openTimeValidator, ErrorMessage.InvalidScheduleOpenTime, 0, 86400);
                openTimeValidator = new ValidationDecorators_1.IsLessThan(openTimeValidator, ErrorMessage.OpenTimeGreaterThanCloseTime, weeklyScheduleList[i].close);
                var openTimeResult = openTimeValidator.validate();
                if (openTimeResult) {
                    console.log('2', openTimeResult);
                    response.err = openTimeResult;
                    response.code = 400;
                    return response;
                }
                var closeTimeValidator = new BaseValidator_1.BaseValidator(weeklyScheduleList[i].close);
                closeTimeValidator = new ValidationDecorators_1.MissingCheck(closeTimeValidator, ErrorMessage.MissingScheduleCloseTime);
                closeTimeValidator = new ValidationDecorators_1.IsNumber(closeTimeValidator, ErrorMessage.InvalidScheduleCloseTime);
                closeTimeValidator = new ValidationDecorators_1.IsInRange(closeTimeValidator, ErrorMessage.InvalidScheduleCloseTime, 0, 86400);
                var closeTimeResult = closeTimeValidator.validate();
                if (closeTimeResult) {
                    console.log('3', closeTimeResult);
                    response.err = openTimeResult;
                    response.code = 400;
                    return response;
                }
                var dayOfWeekValidator = new BaseValidator_1.BaseValidator(weeklyScheduleList[i].day_of_week);
                dayOfWeekValidator = new ValidationDecorators_1.MissingCheck(dayOfWeekValidator, ErrorMessage.MissingDayOfWeek);
                dayOfWeekValidator = new ValidationDecorators_1.IsNumber(dayOfWeekValidator, ErrorMessage.InvalidScheduleDayOfWeek);
                dayOfWeekValidator = new ValidationDecorators_1.IsInRange(dayOfWeekValidator, ErrorMessage.InvalidScheduleDayOfWeek, 0, 6);
                dayOfWeekValidator = new ValidationDecorators_1.IsNotInArray(dayOfWeekValidator, ErrorMessage.DuplicateDayOfWeek, tempArray);
                var dayOfWeekResult = dayOfWeekValidator.validate();
                if (dayOfWeekResult) {
                    console.log('4', dayOfWeekResult);
                    response.err = dayOfWeekResult;
                    response.code = 400;
                    return response;
                }
                tempArray.push(weeklyScheduleList[i].day_of_week);
            }
            var k = yield this.checkWeeklySchedule(salonId);
            if (k.err) {
                saveStatus = undefined;
            }
            else {
                if (k.data) {
                    saveStatus = yield this.updateWeeklySchedule(salonId, weeklyScheduleList);
                }
                else {
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
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
    //this constructor will only be called in subclass contructors;
    //we defer the identification of salonId and employeeId to subclass.
    constructor(salonId, employeeId) {
        this.salonId = salonId;
        this.employeeId = employeeId;
    }
    ;
    getDailySchedule(date) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = {
                code: undefined,
                data: undefined,
                err: undefined
            };
            //TODO: implement validation
            var targetSchedule;
            var dailySchedule = yield this.getDailyScheduleRecord(date);
            if (!dailySchedule.data) {
                var weeklySchedule = yield this.getWeeklyScheduleRecord();
                //start: get dailySchedule from weeklySchedule
                var indexDay = date.getDay();
                for (var i = 0; i <= 6; i++) {
                    if (weeklySchedule.data[i].day_of_week == indexDay) {
                        targetSchedule.open = weeklySchedule.data[i].open;
                        targetSchedule.close = weeklySchedule.data[i].close;
                        targetSchedule.status = weeklySchedule.data[i].status;
                        targetSchedule.date = date;
                    }
                }
            }
            else {
                targetSchedule = dailySchedule.data;
            }
            if (targetSchedule) {
                targetSchedule = yield this.normalizeDailySchedule(targetSchedule);
                response.err = undefined;
                response.data = targetSchedule;
                response.code = 200;
            }
            else {
                response.err = ErrorMessage.ServerError;
                response.data = undefined;
                response.code = 500;
            }
            return response;
        });
    }
    /**
      * name
      */
    getWeeklySchedule() {
        return __awaiter(this, void 0, void 0, function* () {
            var response = {
                code: undefined,
                data: undefined,
                err: undefined
            };
            //TODO: implement validation
            var weeklySchedule = yield this.getWeeklyScheduleRecord();
            if (weeklySchedule.data) {
                weeklySchedule.data = yield this.normalizeWeeklySchedule(weeklySchedule.data);
                response.err = undefined;
                response.code = 200;
                response.data = weeklySchedule.data;
            }
            else {
                response.err = ErrorMessage.ServerError;
                response.code = 500;
                response.data = undefined;
            }
            return response;
        });
    }
    /**
    *
    */
    getMonthlySchedule(month, year) {
        var response;
        //TODO: use getDailyScheduleRecord(date)
        return response;
    }
    saveDailySchedule(dailySchedule) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = {
                code: undefined,
                data: undefined,
                err: undefined
            };
            var saveStatus;
            //validation
            var errorReturn = yield this.dailyScheduleValidation(dailySchedule);
            if (errorReturn) {
                response.code = 400;
                response.err = errorReturn;
                return response;
            }
            //check docs existence: yes>>>> process update, no>>>>> process add
            var k = yield this.checkDailySchedule(dailySchedule);
            if (k.err) {
                saveStatus = undefined;
            }
            else {
                if (k.data) {
                    saveStatus = yield this.updateDailySchedule(dailySchedule);
                }
                else {
                    saveStatus = yield this.addDailySchedule(dailySchedule);
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
    saveWeeklySchedule(weeklyScheduleList) {
        return __awaiter(this, void 0, void 0, function* () {
            var response = {
                code: undefined,
                data: undefined,
                err: undefined
            };
            var saveStatus;
            //validation
            var errorReturn = yield this.weeklyScheduleValidation(weeklyScheduleList);
            if (errorReturn) {
                response.code = 400;
                response.err = errorReturn;
                return response;
            }
            console.log('3');
            //check docs existence: yes>>>process update, no>>>> procee add
            var k = yield this.checkWeeklySchedule();
            console.log('4', k);
            if (k.err) {
                saveStatus = undefined;
            }
            else {
                if (k.data) {
                    saveStatus = yield this.updateWeeklySchedule(weeklyScheduleList);
                    console.log('5', saveStatus);
                }
                else {
                    saveStatus = yield this.addWeeklySchedule(weeklyScheduleList);
                    console.log('6', saveStatus);
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
    checkWeeklySchedule() {
        return __awaiter(this, void 0, void 0, function* () {
            var returnResult = {
                err: undefined,
                code: undefined,
                data: undefined
            };
            var result = yield ScheduleModel_1.WeeklyScheduleModel.findOne({ salon_id: this.salonId, employee_id: this.employeeId }).exec(function (err, docs) {
                if (err) {
                    return returnResult.err = err;
                }
                else if (docs) {
                    return returnResult.data = true;
                }
                else {
                    return returnResult.data = false;
                }
            });
            return returnResult;
        });
    }
    ;
    /**
     * name
     */
    addWeeklySchedule(weeklyScheduleList) {
        return __awaiter(this, void 0, void 0, function* () {
            var returnResult = {
                code: undefined,
                err: undefined,
                data: undefined,
            };
            var dataCreation = ScheduleModel_1.WeeklyScheduleModel.create({
                salon_id: this.salonId,
                employee_id: this.employeeId,
                week: weeklyScheduleList,
            });
            yield dataCreation.then(function (docs) {
                returnResult.data = true;
                return;
            }, function (error) {
                returnResult.err = error;
                return;
            });
            return returnResult;
        });
    }
    ;
    /**
     * name
     */
    updateWeeklySchedule(weeklyScheduleList) {
        return __awaiter(this, void 0, void 0, function* () {
            var returnResult = {
                code: undefined,
                data: undefined,
                err: undefined
            };
            var docsFound = yield ScheduleModel_1.WeeklyScheduleModel.findOne({ salon_id: this.salonId, employee_id: this.employeeId }).exec();
            docsFound.week = weeklyScheduleList;
            var saveAction = docsFound.save();
            //saveAction is a promise returned by mongoose so we must use 'await' on its resolution.
            yield saveAction.then(function (docs) {
                returnResult.data = true;
            }, function (err) {
                returnResult.err = err;
            });
            return returnResult;
        });
    }
    ;
    /**
     * name
     */
    weeklyScheduleValidation(weeklyScheduleList) {
        return __awaiter(this, void 0, void 0, function* () {
            var errorReturn = undefined;
            var tempArray = [];
            for (let i = 0; i <= 6; i++) {
                var openTimeValidator = new BaseValidator_1.BaseValidator(weeklyScheduleList[i].open);
                openTimeValidator = new ValidationDecorators_1.MissingCheck(openTimeValidator, ErrorMessage.MissingScheduleOpenTime);
                openTimeValidator = new ValidationDecorators_1.IsNumber(openTimeValidator, ErrorMessage.InvalidScheduleOpenTime);
                openTimeValidator = new ValidationDecorators_1.IsInRange(openTimeValidator, ErrorMessage.InvalidScheduleOpenTime, 0, 86400);
                openTimeValidator = new ValidationDecorators_1.IsLessThan(openTimeValidator, ErrorMessage.OpenTimeGreaterThanCloseTime, weeklyScheduleList[i].close);
                var openTimeResult = yield openTimeValidator.validate();
                if (openTimeResult) {
                    return errorReturn = openTimeResult;
                }
                var closeTimeValidator = new BaseValidator_1.BaseValidator(weeklyScheduleList[i].close);
                closeTimeValidator = new ValidationDecorators_1.MissingCheck(closeTimeValidator, ErrorMessage.MissingScheduleCloseTime);
                closeTimeValidator = new ValidationDecorators_1.IsNumber(closeTimeValidator, ErrorMessage.InvalidScheduleCloseTime);
                closeTimeValidator = new ValidationDecorators_1.IsInRange(closeTimeValidator, ErrorMessage.InvalidScheduleCloseTime, 0, 86400);
                var closeTimeResult = yield closeTimeValidator.validate();
                if (closeTimeResult) {
                    return errorReturn = openTimeResult;
                }
                var dayOfWeekValidator = new BaseValidator_1.BaseValidator(weeklyScheduleList[i].day_of_week);
                dayOfWeekValidator = new ValidationDecorators_1.MissingCheck(dayOfWeekValidator, ErrorMessage.MissingDayOfWeek);
                dayOfWeekValidator = new ValidationDecorators_1.IsNumber(dayOfWeekValidator, ErrorMessage.InvalidScheduleDayOfWeek);
                dayOfWeekValidator = new ValidationDecorators_1.IsInRange(dayOfWeekValidator, ErrorMessage.InvalidScheduleDayOfWeek, 0, 6);
                dayOfWeekValidator = new ValidationDecorators_1.IsNotInArray(dayOfWeekValidator, ErrorMessage.DuplicateDayOfWeek, tempArray);
                var dayOfWeekResult = yield dayOfWeekValidator.validate();
                if (dayOfWeekResult) {
                    return errorReturn = dayOfWeekResult;
                }
                tempArray.push(weeklyScheduleList[i].day_of_week);
            }
            return errorReturn;
        });
    }
    ;
    /**
     * name
     */
    checkDailySchedule(dailySchedule) {
        return __awaiter(this, void 0, void 0, function* () {
            var returnResult = {
                err: undefined,
                code: undefined,
                data: undefined
            };
            var result = yield ScheduleModel_1.DailyScheduleModel.findOne({ salon_id: this.salonId, employee_id: this.employeeId, "day.date": dailySchedule._id }).exec(function (err, docs) {
                if (err) {
                    return returnResult.err = err;
                }
                else if (docs) {
                    return returnResult.data = true;
                }
                else {
                    return returnResult.data = false;
                }
            });
            return returnResult;
        });
    }
    ;
    /**
     * name
     */
    addDailySchedule(dailySchedule) {
        return __awaiter(this, void 0, void 0, function* () {
            var returnResult = {
                code: undefined,
                err: undefined,
                data: undefined,
            };
            var dataCreation = ScheduleModel_1.DailyScheduleModel.create({
                salon_id: this.salonId,
                employee_id: this.employeeId,
                day: dailySchedule,
            });
            yield dataCreation.then(function (docs) {
                returnResult.data = true;
                return;
            }, function (error) {
                returnResult.err = error;
                return;
            });
            return returnResult;
        });
    }
    ;
    /**
     * name
     */
    updateDailySchedule(dailySchedule) {
        return __awaiter(this, void 0, void 0, function* () {
            var returnResult = {
                code: undefined,
                data: undefined,
                err: undefined
            };
            var docsFound = yield ScheduleModel_1.DailyScheduleModel.findOne({ salon_id: this.salonId, employee_id: this.employeeId }).exec();
            docsFound.day = dailySchedule;
            var saveAction = docsFound.save();
            //saveAction is a promise returned by mongoose so we must use 'await' on its resolution.
            yield saveAction.then(function (docs) {
                returnResult.data = true;
            }, function (err) {
                returnResult.err = err;
            });
            return returnResult;
        });
    }
    ;
    /**
     * name
     */
    dailyScheduleValidation(dailySchedule) {
        return __awaiter(this, void 0, void 0, function* () {
            var errorReturn = undefined;
            var openTimeValidator = new BaseValidator_1.BaseValidator(dailySchedule.open);
            openTimeValidator = new ValidationDecorators_1.MissingCheck(openTimeValidator, ErrorMessage.MissingScheduleOpenTime);
            openTimeValidator = new ValidationDecorators_1.IsNumber(openTimeValidator, ErrorMessage.InvalidScheduleOpenTime);
            openTimeValidator = new ValidationDecorators_1.IsInRange(openTimeValidator, ErrorMessage.InvalidScheduleOpenTime, 0, 86400);
            openTimeValidator = new ValidationDecorators_1.IsLessThan(openTimeValidator, ErrorMessage.OpenTimeGreaterThanCloseTime, dailySchedule.close);
            var openTimeResult = yield openTimeValidator.validate();
            if (openTimeResult) {
                return errorReturn = openTimeResult;
            }
            var closeTimeValidator = new BaseValidator_1.BaseValidator(dailySchedule.close);
            closeTimeValidator = new ValidationDecorators_1.MissingCheck(closeTimeValidator, ErrorMessage.MissingScheduleCloseTime);
            closeTimeValidator = new ValidationDecorators_1.IsNumber(closeTimeValidator, ErrorMessage.InvalidScheduleCloseTime);
            closeTimeValidator = new ValidationDecorators_1.IsInRange(closeTimeValidator, ErrorMessage.InvalidScheduleCloseTime, 0, 86400);
            var closeTimeResult = yield closeTimeValidator.validate();
            if (closeTimeResult) {
                return errorReturn = openTimeResult;
            }
            //Todo: validate date;
            return errorReturn;
        });
    }
    ;
    /**
     * name
     */
    getDailyScheduleRecord(date) {
        return __awaiter(this, void 0, void 0, function* () {
            var returnResult = {
                err: undefined,
                code: undefined,
                data: undefined
            };
            var dailyDocsReturn = yield ScheduleModel_1.DailyScheduleModel.findOne({ salonId: this.salonId, employeeId: this.employeeId, 'day.date': date }).exec(function (err, docs) {
                if (err) {
                    returnResult.err = err;
                }
                else {
                    if (!docs) {
                        returnResult.data = undefined;
                    }
                    else {
                        returnResult.data = docs.day;
                    }
                }
            });
            return returnResult;
        });
    }
    /**
     * name
     */
    getWeeklyScheduleRecord() {
        return __awaiter(this, void 0, void 0, function* () {
            var returnResult = {
                err: undefined,
                code: undefined,
                data: undefined
            };
            var weeklyDocsReturn = yield ScheduleModel_1.WeeklyScheduleModel.findOne({ salonId: this.salonId, employeeId: this.employeeId }).exec(function (err, docs) {
                if (err) {
                    returnResult.err = err;
                }
                else {
                    if (!docs) {
                        returnResult.data = undefined;
                    }
                    else {
                        returnResult.data = docs.week;
                    }
                }
            });
            return returnResult;
        });
    }
}
exports.Schedule = Schedule;
//# sourceMappingURL=Schedule.js.map
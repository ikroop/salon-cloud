"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const Schedule_1 = require("./Schedule");
const ScheduleModel_1 = require("./ScheduleModel");
const BaseValidator_1 = require("./../../core/validation/BaseValidator");
const ValidationDecorators_1 = require("./../../core/validation/ValidationDecorators");
var ErrorMessage = require("../../core/ErrorMessage");
class EmployeeSchedule extends Schedule_1.Schedule {
    constructor(salonId, employeeId) {
        super();
        this.salonId = salonId;
        this.employeeId = employeeId;
    }
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
    weeklyScheduleValidation(weeklyScheduleList) {
        return __awaiter(this, void 0, void 0, function* () {
            var errorReturn = undefined;
            /*var salonIdValidator = new BaseValidator(this.salonId);
            salonIdValidator = new MissingCheck(salonIdValidator, ErrorMessage.MissingSalonId);
            salonIdValidator = new IsString(salonIdValidator, ErrorMessage.InvalidSalonId);
            //TODO: validate salon Id;
            salonIdValidator = new IsValidSalonId(salonIdValidator, ErrorMessage.InvalidSalonId);
            var salonIdResult = await salonIdValidator.validate();
            if(salonIdResult){
                return errorReturn = salonIdResult;
            }*/
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
    dailyScheduleValidation(dailySchedule) {
        return __awaiter(this, void 0, void 0, function* () {
            var errorReturn = undefined;
            /*var salonIdValidator = new BaseValidator(this.salonId);
            salonIdValidator = new MissingCheck(salonIdValidator, ErrorMessage.MissingSalonId);
            salonIdValidator = new IsString(salonIdValidator, ErrorMessage.InvalidSalonId);
            salonIdValidator = new IsValidSalonId(salonIdValidator, ErrorMessage.InvalidSalonId);
            var salonIdResult = await salonIdValidator.validate();
            if(salonIdResult){
                return errorReturn = salonIdResult;
            }*/
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
}
exports.EmployeeSchedule = EmployeeSchedule;
//# sourceMappingURL=EmployeeSchedule.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
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
                    console.log('1', saveStatus);
                }
                else {
                    saveStatus = yield this.addDailySchedule(dailySchedule);
                    console.log('2', saveStatus);
                }
            }
            response.data = saveStatus.data;
            console.log('rrrre', response);
            if (!saveStatus.err) {
                console.log('200', saveStatus);
                response.code = 200;
                response.err = undefined;
            }
            else {
                console.log('500', saveStatus);
                response.code = 500;
                response.err = ErrorMessage.ServerError;
            }
            console.log('rrrr', response);
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
}
exports.Schedule = Schedule;
//# sourceMappingURL=Schedule.js.map
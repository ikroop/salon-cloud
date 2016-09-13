/**
 *
 *
 */
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
var ErrorMessage = require("../../core/ErrorMessage");
class SalonSchedule extends Schedule_1.Schedule {
    addDailySchedule(salonId, dailySchedule) {
        return __awaiter(this, void 0, void 0, function* () {
            var k = {
                code: undefined,
                data: undefined,
                err: undefined
            };
            var docsFound = yield ScheduleModel_1.ScheduleModel.findOne({ "_id": salonId }).exec();
            docsFound.salon.daily.push(dailySchedule);
            var saveAction = docsFound.save();
            //saveAction is a promise returned by mongoose so we must use 'await' on its resolution.
            yield saveAction.then(function (docs) {
                console.log('dd', docs);
                k.data = true;
            }, function (err) {
                console.log('ee', err);
                k.err = err;
            });
            return k;
        });
    }
    addWeeklySchedule(salonId, weeklyScheduleList) {
        return __awaiter(this, void 0, void 0, function* () {
            //Todo: DISCUSS IF CAN DO THIS??
            /*var k: SalonCloudResponse<boolean>;
            await ScheduleModel.findOne({"_id": salonId}).exec(function(err, docs){
                if(err){
                    return k.err = err;
                }else if(!docs){
                    //Todo: return error or create default docs;
                    return;
                }else{
                    docs.salon.weekly = weeklyScheduleList;
                    docs.save(function(err, updatedDocs){
                        if(err){
                           return k.err = err;
                        }else{
                            return k.data = true;
                        }
                    })
                    return k;
                }
    
            })
    
            return k;
            */
            return yield this.updateWeeklySchedule(salonId, weeklyScheduleList);
        });
    }
    checkDailySchedule(salonId, dailySchedule) {
        return __awaiter(this, void 0, void 0, function* () {
            var k = {
                err: undefined,
                code: undefined,
                data: undefined
            };
            var result = yield ScheduleModel_1.ScheduleModel.findOne({ "_id": salonId }).exec(function (err, docs) {
                if (err) {
                    return k.err = err;
                }
                else if (docs) {
                    if (docs.salon.daily.id(dailySchedule._id)) {
                        return k.data = true;
                    }
                    else {
                        return k.data = false;
                    }
                }
                else {
                    //Todo: return error or created default docs;
                    return;
                }
            });
            return k;
        });
    }
    checkWeeklySchedule(salonId) {
        return __awaiter(this, void 0, void 0, function* () {
            var k = {
                err: undefined,
                code: undefined,
                data: undefined
            };
            var result = yield ScheduleModel_1.ScheduleModel.findOne({ "_id": salonId }).exec(function (err, docs) {
                if (err) {
                    return k.err = err;
                }
                else if (docs) {
                    if (docs.salon.weekly) {
                        return k.data = true;
                    }
                    else {
                        return k.data = false;
                    }
                }
                else {
                    //Todo: return error or created default docs;
                    return;
                }
            });
            return k;
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
    updateDailySchedule(salonId, dailySchedule) {
        return __awaiter(this, void 0, void 0, function* () {
            var k = {
                code: undefined,
                data: undefined,
                err: undefined
            };
            var docsFound = yield ScheduleModel_1.ScheduleModel.findOne({ "_id": salonId }).exec();
            docsFound.salon.daily.id(dailySchedule._id).status = dailySchedule.status;
            console.log(docsFound.salon.daily.id(dailySchedule._id));
            yield docsFound.save().then(function (docs) {
                return k.data = true;
            }, function (err) {
                return k.err = err;
            });
            return k;
        });
    }
    updateWeeklySchedule(salonId, weeklyScheduleList) {
        return __awaiter(this, void 0, void 0, function* () {
            var k = {
                code: undefined,
                data: undefined,
                err: undefined
            };
            var docsFound = yield ScheduleModel_1.ScheduleModel.findOne({ "_id": salonId }).exec();
            docsFound.salon.weekly = weeklyScheduleList;
            var saveAction = docsFound.save();
            //saveAction is a promise returned by mongoose so we must use 'await' on its resolution.
            yield saveAction.then(function (docs) {
                k.data = true;
            }, function (err) {
                k.err = err;
            });
            return k;
        });
    }
}
exports.SalonSchedule = SalonSchedule;
//# sourceMappingURL=SalonSchedule.js.map
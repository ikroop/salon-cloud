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
    addDailySchedule(dailySchedule) {
        return false;
    }
    addWeeklySchedule(salonId, weeklyScheduleList) {
        return __awaiter(this, void 0, void 0, function* () {
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
    checkDailySchedule(dailySchedule) {
        return false;
    }
    checkWeeklySchedule(salonId) {
        return __awaiter(this, void 0, void 0, function* () {
            var k = {
                err: null,
                code: null,
                data: false
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
            console.log(k);
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
    updateDailySchedule(dailySchedule) {
        return false;
    }
    updateWeeklySchedule(salonId, weeklyScheduleList) {
        return __awaiter(this, void 0, void 0, function* () {
            var k = {
                code: null,
                data: null,
                err: null
            };
            var l = yield ScheduleModel_1.ScheduleModel.findOne({ "_id": salonId }).exec();
            console.log('l', l);
            weeklyScheduleList[0].close = 44455;
            l.salon.weekly = weeklyScheduleList;
            var f = yield l.save();
            console.log('f', f.salon.weekly);
            if (f) {
                k.data = true;
            }
            else {
                k.err = ErrorMessage.ServerError;
            }
            /*l.then(async function(err, docs){
                if(err){
                    return k.err = err;
                }else if(!docs){
    
                    //Todo: return error or create default docs;
                    return;
                }else{
                    docs.salon.weekly = weeklyScheduleList;
                    console.log('2');
                     var test =  await docs.save(function(err, updatedDocs){
                        if(err){
                           return k.err = err;
                        }else{
                            console.log('3');
                            return k.data = true;
                        }
                    });
                    console.log('4',test);
                    return test;
                }
            });*/
            return k;
        });
    }
}
exports.SalonSchedule = SalonSchedule;
//# sourceMappingURL=SalonSchedule.js.map
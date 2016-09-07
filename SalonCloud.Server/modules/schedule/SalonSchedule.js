/**
 *
 *
 */
"use strict";
const Schedule_1 = require("./Schedule");
class SalonSchedule extends Schedule_1.Schedule {
    addDailySchedule(dailySchedule) {
        return false;
    }
    addWeeklySchedule(weeklyScheduleList) {
        return true;
    }
    checkDailySchedule(dailySchedule) {
        return false;
    }
    checkWeeklySchedule(salonId) {
        return true;
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
    updateWeeklySchedule(weeklyScheduleList) {
        return true;
    }
}
exports.SalonSchedule = SalonSchedule;
//# sourceMappingURL=SalonSchedule.js.map
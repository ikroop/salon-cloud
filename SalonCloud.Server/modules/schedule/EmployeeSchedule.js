"use strict";
const Schedule_1 = require("./Schedule");
class EmployeeSchedule extends Schedule_1.Schedule {
    addDailySchedule(dailySchedule) {
        return false;
    }
    addWeeklySchedule(weeklyScheduleList) {
        return false;
    }
    checkDailySchedule(dailySchedule) {
        return false;
    }
    checkWeeklySchedule() {
        return false;
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
        return false;
    }
}
exports.EmployeeSchedule = EmployeeSchedule;
//# sourceMappingURL=EmployeeSchedule.js.map
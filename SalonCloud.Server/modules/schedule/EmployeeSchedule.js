"use strict";
<<<<<<< HEAD
class EmployeeSchedule {
    /**
     * name
     */
    getSchedule(startDate, endDate, callback) {
        return undefined;
    }
    /**
     * name
     */
    getWeeklySchedule(callback) {
        return undefined;
    }
    /**
     * name
     */
    insertWeekly(salonId, schedule, callback) {
    }
    /**
     * name
     */
    insertDaily(schedule, callback) {
=======
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
>>>>>>> origin/master
    }
}
exports.EmployeeSchedule = EmployeeSchedule;
//# sourceMappingURL=EmployeeSchedule.js.map
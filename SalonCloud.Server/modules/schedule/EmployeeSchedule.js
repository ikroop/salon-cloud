"use strict";
const Schedule_1 = require("./Schedule");
var ErrorMessage = require("../../core/ErrorMessage");
class EmployeeSchedule extends Schedule_1.Schedule {
    constructor(salonId, employeeId) {
        super(salonId, employeeId);
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
}
exports.EmployeeSchedule = EmployeeSchedule;
//# sourceMappingURL=EmployeeSchedule.js.map
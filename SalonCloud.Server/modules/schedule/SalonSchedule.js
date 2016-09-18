/**
 *
 *
 */
"use strict";
const Schedule_1 = require("./Schedule");
var ErrorMessage = require("../../core/ErrorMessage");
class SalonSchedule extends Schedule_1.Schedule {
    constructor(salonId) {
        super(salonId, null);
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
exports.SalonSchedule = SalonSchedule;
//# sourceMappingURL=SalonSchedule.js.map
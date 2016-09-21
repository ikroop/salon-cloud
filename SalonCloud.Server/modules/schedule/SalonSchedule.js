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
    normalizeDailySchedule(dailySchedule) {
        //do nothing, dummy method
        return dailySchedule;
    }
    normalizeWeeklySchedule(weeklySchedule) {
        //do nothing, dummy method
        return weeklySchedule;
    }
}
exports.SalonSchedule = SalonSchedule;
//# sourceMappingURL=SalonSchedule.js.map
"use strict";
const Schedule_1 = require("./Schedule");
var ErrorMessage = require("../../core/ErrorMessage");
class EmployeeSchedule extends Schedule_1.Schedule {
    constructor(salonId, employeeId) {
        super(salonId, employeeId);
    }
    normalizeDailySchedule(dailySchedule) {
        //Todo: implementation >>> compare with salon to get the best schedule
        return dailySchedule;
    }
    normalizeWeeklySchedule(WeeklySchedule) {
        //Todo: implementation >>>> compare with salon to get the best schedules
        return WeeklySchedule;
    }
    ;
}
exports.EmployeeSchedule = EmployeeSchedule;
//# sourceMappingURL=EmployeeSchedule.js.map
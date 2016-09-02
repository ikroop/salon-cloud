"use strict";
var ErrorMessage = require('./../../routes/ErrorMessage');
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
    /**
     * name
     */
    saveWeeklySchedule(weeklyScheduleList) {
        var response;
        var saveStatus;
        //TODO: implement validation
        if (this.checkWeeklySchedule()) {
            saveStatus = this.updateWeeklySchedule(weeklyScheduleList);
        }
        else {
            saveStatus = this.addWeeklySchedule(weeklyScheduleList);
        }
        response.data = saveStatus;
        if (saveStatus) {
            response.code = 200;
            response.err = undefined;
        }
        else {
            response.code = 500;
            response.err = ErrorMessage.ServerError;
        }
        return response;
    }
    /**
     * name
     */
    saveDailySchedule(dailySchedule) {
        var response;
        var saveStatus;
        //TODO: implement validation
        if (this.checkDailySchedule(dailySchedule)) {
            saveStatus = this.updateDailySchedule(dailySchedule);
        }
        else {
            saveStatus = this.addDailySchedule(dailySchedule);
        }
        response.data = saveStatus;
        if (saveStatus) {
            response.code = 200;
            response.err = undefined;
        }
        else {
            response.code = 500;
            response.err = ErrorMessage.ServerError;
        }
        return response;
    }
}
exports.Schedule = Schedule;
//# sourceMappingURL=Schedule.js.map
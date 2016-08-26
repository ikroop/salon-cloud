"use strict";
// import * as mongoose from "mongoose";
const Schedule_1 = require('./Schedule');
class WeeklySchedule extends Schedule_1.Schedule {
    constructor(id, salonId, close, open, status, dayOfWeek) {
        super(id, salonId, open, close, status);
        this.dayofweek = dayOfWeek;
    }
    exportProfile() {
        let weeklyScheduleProfile = {
            _id: this.id,
            salon_id: this.salon_id,
            // employee_id: string,
            // created_date: Date,
            // last_modified: Date,
            // created_by: <UserProfile>,
            close: this.close,
            open: this.open,
            status: this.status,
            dayofweek: this.dayofweek
        };
        return weeklyScheduleProfile;
    }
}
exports.WeeklySchedule = WeeklySchedule;
//# sourceMappingURL=WeeklySchedule.js.map
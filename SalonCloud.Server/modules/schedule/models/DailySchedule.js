"use strict";
// import * as mongoose from "mongoose";
const Schedule_1 = require('./Schedule');
class DailySchedule extends Schedule_1.Schedule {
    constructor(id, salonId, close, open, status, date) {
        super(id, salonId, open, close, status);
        this.date = date;
    }
    exportProfile() {
        let dailyScheduleProfile = {
            _id: this.id,
            salon_id: this.salon_id,
            // employee_id: string,
            // created_date: Date,
            // last_modified: Date,
            // created_by: <UserProfile>,
            close: this.close,
            open: this.open,
            status: this.status,
            date: this.date
        };
        return dailyScheduleProfile;
    }
}
exports.DailySchedule = DailySchedule;
//# sourceMappingURL=DailySchedule.js.map
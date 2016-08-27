/*import * as mongoose from "mongoose";
import {Schedule} from './../ScheduleData';
import {DailyScheduleProfile} from './DailyScheduleModel';

export class DailySchedule extends Schedule {
    private date: Date;

    constructor(id: string, salonId: string, close: number, open:number, status: boolean, date: Date) {
        super(id, salonId, open, close, status);
        this.date = date;
    }

    public exportProfile (): DailyScheduleProfile {
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
}*/
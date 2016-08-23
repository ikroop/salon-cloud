//
//
//
//
import * as mongoose from "mongoose";
import {Schedule} from 'ScheduleData';
// import {UserProfileSchema} from '../../user/UserProfile';

export const DailyScheduleSchema = new mongoose.Schema({
    id: {type: String, required: true},
    // employee_id: {type: String, required: true},
    // created_date: {type: Date, required: true},
    // last_modified: {type: Date, required: true},
    // created_by: {type: UserProfileSchema, required: true},
    close: {type: Number, required: true},
    open: {type: Number, required: true},
    status: {type: Boolean, required: true},
    date: {type: Number, required: true}
});

export const DailyScheduleModel = mongoose.model('DailySchedule', DailyScheduleSchema);

export class DailySchedule extends Schedule {
    private date: Date;
}
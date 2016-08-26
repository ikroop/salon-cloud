import * as mongoose from "mongoose";
import {ScheduleProfile} from './ScheduleModel';
// import {UserProfileSchema} from '../../user/UserProfile';

export interface WeeklyScheduleProfile extends ScheduleProfile {
    dayofweek: number
}

export const WeeklyScheduleSchema = new mongoose.Schema({
    salon_id: {type: String, required: true},
    // employee_id: {type: String, required: true},
    // created_date: {type: Date, required: true},
    // last_modified: {type: Date, required: true},
    // created_by: {type: UserProfileSchema, required: true},
    close: {type: Number, required: true},
    open: {type: Number, required: true},
    status: {type: Boolean, required: true},
    dayofweek: {type: Number, required: true}
});

export const WeeklyScheduleModel = mongoose.model<WeeklyScheduleProfile>('WeeklySchedule', WeeklyScheduleSchema);



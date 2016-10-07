
import { mongoose } from "../../services/database";
import {WeeklyScheduleData, DailyScheduleData} from './ScheduleData'

export const WeeklyDaySchema = new mongoose.Schema({
    close: { type: Number, required: true },
    open: { type: Number, required: true },
    status: { type: Boolean, required: true },
    day_of_week: { type: Number, required: true }
}, {
        _id: false,
        timestamps: { createdAt: 'created_at', modifiedAt: 'modified_at' }
    });

export const DailyDaySchema = new mongoose.Schema({
    close: { type: Number, required: true },
    open: { type: Number, required: true },
    status: { type: Boolean, required: true },
    date: { type: Date, required: true }
}, {
        _id: false,
        timestamps: { createdAt: 'created_at', modifiedAt: 'modified_at' }
    });

export const WeeklyScheduleSchema = new mongoose.Schema({
    salon_id: String, //<salon_id>
    employee_id: String, //employee_id
    week: [WeeklyDaySchema],

}, {
        timestamps: { createdAt: 'created_at', modifiedAt: 'modified_at' }
    });

export const DailyScheduleSchema = new mongoose.Schema({
    salon_id: String, //<salon_id>
    employee_id: String,
    day: DailyDaySchema,
})
export const WeeklyScheduleModel = mongoose.model<WeeklyScheduleData>('WeeklySchedule', WeeklyScheduleSchema);
export const DailyScheduleModel = mongoose.model<DailyScheduleData>('DailySchedule', DailyScheduleSchema);

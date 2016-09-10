
import { mongoose } from "../../services/database";
import {ScheduleData} from './ScheduleData'

export const WeeklyScheduleSchema = new mongoose.Schema({
    _id: {type: Number, required: true},
    close: {type: Number, required: true},
    open: {type: Number, required: true},
    status: {type: Boolean, required: true},
    day_of_week: {type: Number, required: true}
},{
    _id: false,
    timestamps: {createdAt: 'created_at', modifiedAt: 'modified_at'}
});

export const DailyScheduleSchema = new mongoose.Schema({
    _id: {type: Number, required: true},
    close: {type: Number, required: true},
    open: {type: Number, required: true},
    status: {type: Boolean, required: true},
    date: {type: Date, required: true}
}, {
    _id: false,
    timestamps: {createdAt: 'created_at', modifiedAt: 'modified_at'}
});
export const DailyScheduleModel = mongoose.model<DailyScheduleData>('DailySchedule', DailyScheduleSchema);

export const ScheduleSchema = new mongoose.Schema({
    _id: String, //<salon_id>
    salon:{
        weekly: [WeeklyScheduleSchema],
        daily: [DailyScheduleSchema]
    },
    employee:[{
        employee_id: { type: String, required: true },
        weekly: [WeeklyScheduleSchema],
        daily: [DailyScheduleSchema]
    }]
},{
    _id: false,
    timestamps: {createdAt: 'created_at', modifiedAt: 'modified_at'}
});
export const ScheduleModel = mongoose.model<ScheduleData>('Schedule', ScheduleSchema);


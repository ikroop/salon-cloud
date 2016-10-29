
import { mongoose } from "./../../Services/Database";
import { IWeeklyScheduleData } from './ScheduleData'

const WeeklyDaySchema = new mongoose.Schema({
    close: { type: Number, required: true },
    open: { type: Number, required: true },
    status: { type: Boolean, required: true },
    day_of_week: { type: Number, required: true }
}, {
        _id: false,
        timestamps: { createdAt: 'created_at', modifiedAt: 'modified_at' }
    });

const WeeklyScheduleSchema = new mongoose.Schema({
    salon_id: String, //<salon_id>
    employee_id: String, //employee_id
    week: [WeeklyDaySchema],

}, {
        timestamps: { createdAt: 'created_at', modifiedAt: 'modified_at' }
    });

var WeeklyScheduleModel = mongoose.model<IWeeklyScheduleData>('WeeklySchedule', WeeklyScheduleSchema);
export = WeeklyScheduleModel;

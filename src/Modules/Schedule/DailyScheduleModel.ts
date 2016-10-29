
import { mongoose } from './../../Services/Database';
import { IDailyScheduleData } from './ScheduleData'


const DailyDaySchema = new mongoose.Schema({
    close: { type: Number, required: true },
    open: { type: Number, required: true },
    status: { type: Boolean, required: true },
    date: { type: Date, required: true }
}, {
        _id: false,
        timestamps: { createdAt: 'created_at', modifiedAt: 'modified_at' }
    });


const DailyScheduleSchema = new mongoose.Schema({
    salon_id: String, //<salon_id>
    employee_id: String,
    day: DailyDaySchema,
});

var DailyScheduleModel = mongoose.model<IDailyScheduleData>('DailySchedule', DailyScheduleSchema);
export = DailyScheduleModel;
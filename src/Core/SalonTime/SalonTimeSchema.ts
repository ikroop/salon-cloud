
/**
 * 
 */
import { mongoose } from '../../Services/Database';
import {ISalonTimeData} from './SalonTimeData'

 const SalonTimeSchema = new mongoose.Schema({
    min: {type: Number, require: true},
    hour: {type: Number, require: true},
    day: {type: Number, require: true},
    month: {type: Number, require: true},
    year: {type: Number, require: true}
})

var SalonTimeModel = mongoose.model<ISalonTimeData>('WeeklySchedule', SalonTimeSchema);
export = SalonTimeModel;
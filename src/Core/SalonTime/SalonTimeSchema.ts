
/**
 * 
 */
import { mongoose } from '../../Services/Database';

export const SalonTimeSchema = new mongoose.Schema({
    min: {type: Number, require: true},
    hour: {type: Number, require: true},
    day: {type: Number, require: true},
    month: {type: Number, require: true},
    year: {type: Number, require: true}
})


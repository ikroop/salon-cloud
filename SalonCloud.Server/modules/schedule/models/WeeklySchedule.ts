// import * as mongoose from "mongoose";
import {Schedule} from './Schedule';
// import {UserProfileSchema} from '../../user/UserProfile';

export class WeeklySchedule extends Schedule {
    dayofweek: number;
}


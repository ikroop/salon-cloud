//
//
//
//
//
//
import { Schedule } from './models/Schedule';
import { DailySchedule } from './models/DailySchedule';
import { WeeklySchedule } from './models/WeeklySchedule';
import { WeeklyScheduleProfile} from './models/WeeklyScheduleModel';

export interface ScheduleBehavior{
    /**
     * name
     */
    getSchedule(startDate: Date, endDate: Date): [DailySchedule];

    /**
     * name
     */
    getWeeklySchedule(): [WeeklySchedule];

    /**
     * name
     */
    insertWeekly(schedule: WeeklyScheduleProfile, callback);

    /**
     * name
     */
    insertDaily(schedule: Schedule);

    /**
     * name
     */
    validate(schedule: Schedule);
}
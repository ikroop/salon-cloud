//
//
//
//
//
//
import {Schedule} from './models/Schedule';
import {DailySchedule} from './models/DailySchedule';
import {WeeklySchedule} from './models/WeeklySchedule';

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
    insert(schedule: Schedule);

    /**
     * name
     */
    validate(schedule: Schedule);
}
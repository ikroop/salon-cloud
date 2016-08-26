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

export abstract class ScheduleBehavior{
    /**
     * name
     */
    public getSchedule(startDate: Date, endDate: Date, callback): [DailySchedule] {
        return undefined;
    }

    /**
     * name
     */
    public getWeeklySchedule(callback): [WeeklySchedule] {
        return undefined;
    }

    /**
     * name
     */
    abstract insertWeekly(schedule: WeeklySchedule, callback);

    /**
     * name
     */
    abstract insertDaily(schedule: DailySchedule, callback);

    /**
     * name
     */
     public insert(schedule: Schedule, callback) {
     }

    /**
     * name
     */
    public validate(schedule: Schedule, callback) {
    }
}
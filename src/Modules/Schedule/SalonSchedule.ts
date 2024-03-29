/**
 * 
 * 
 */

import { mongoose } from './../../Services/Database';
import { Schedule } from './Schedule';
import { DailyDayData, WeeklyDayData } from './ScheduleData';
import { SalonCloudResponse } from './../../Core/SalonCloudResponse';
import { BaseValidator } from './../../Core/Validation/BaseValidator';
import { MissingCheck, IsInRange, IsString, IsNumber, IsGreaterThan, IsLessThan, IsNotInArray, IsValidSalonId }
    from './../../Core/Validation/ValidationDecorators';
import { ErrorMessage } from './../../Core/ErrorMessage';

export class SalonSchedule extends Schedule {

    constructor(salonId: string) {
        super(salonId, null);
    }

    protected normalizeDailySchedule(dailySchedule: DailyDayData[]) {
        //do nothing, dummy method
        return dailySchedule;
    }
    protected normalizeWeeklySchedule(weeklySchedule: [WeeklyDayData]) {
        //do nothing, dummy method
        return weeklySchedule
    }

    protected async validateExt(): Promise<SalonCloudResponse<null>> {
        return null;
    }
}
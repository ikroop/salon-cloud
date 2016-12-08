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
var ErrorMessage = require('./../../Core/ErrorMessage');

export class SalonSchedule extends Schedule {

    constructor(salonId: string) {
        super(salonId, undefined);
    }

    protected normalizeDailySchedule(dailySchedule: DailyDayData[]) {
        //do nothing, dummy method
        return dailySchedule;
    }
    protected normalizeWeeklySchedule(weeklySchedule: [WeeklyDayData]) {
        //do nothing, dummy method
        return weeklySchedule
    }

    protected async validateExt(): Promise<SalonCloudResponse<any>>{
        return undefined;
    }
}
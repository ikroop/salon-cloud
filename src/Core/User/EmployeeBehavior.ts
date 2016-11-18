/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import {SalonCloudResponse} from './../SalonCloudResponse'
import {EmployeeSchedule} from './../../Modules/Schedule/EmployeeSchedule'
import {SalonSchedule} from './../../Modules/Schedule/SalonSchedule'
import {DailyDayData, WeeklyDayData} from './../../Modules/Schedule/ScheduleData'

export interface EmployeeBehavior {
    employeeScheduleDp : EmployeeSchedule;
    salonScheduleDp : SalonSchedule;

    getSalonSchedule(start : Date, end : Date) : SalonCloudResponse<Array<DailyDayData>>;

    getSchedule(start : Date, end : Date) : SalonCloudResponse<Array<DailyDayData>>;
}
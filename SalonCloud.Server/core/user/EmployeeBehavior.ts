

import {SalonCloudResponse} from './../SalonCloudResponse'
import {EmployeeSchedule} from './../../modules/schedule/EmployeeSchedule'
import {SalonSchedule} from './../../modules/schedule/SalonSchedule'
import {DailyDayData, WeeklyDayData} from './../../modules/schedule/ScheduleData'

export interface EmployeeBehavior {
    employeeScheduleDp : EmployeeSchedule;
    salonScheduleDp : SalonSchedule;

    getSalonSchedule(start : Date, end : Date) : SalonCloudResponse<Array<DailyDayData>>;

    getSchedule(start : Date, end : Date) : SalonCloudResponse<Array<DailyDayData>>;
}
/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { SalonUser } from './SalonUser'
import { EmployeeBehavior } from './EmployeeBehavior'
import { UserProfile } from './../../Modules/UserManagement/UserData'
import { AppointmentData } from './../../Modules/AppointmentManagement/AppointmentData'
import { DailyDayData, WeeklyDayData } from './../../Modules/Schedule/ScheduleData'
import { EmployeeSchedule } from './../../Modules/Schedule/EmployeeSchedule'
import { SalonSchedule } from './../../Modules/Schedule/SalonSchedule'
import { SalonCloudResponse } from './../SalonCloudResponse'

export abstract class AbstractEmployee extends SalonUser implements EmployeeBehavior {

    employeeScheduleDp: EmployeeSchedule;
    salonScheduleDp: SalonSchedule;

    public getAppointmentByDate(date: Date): Array<AppointmentData> {

        return;
    };

    public getAppointmentById(appointmentId: string): AppointmentData {

        return;
    };

    public getSalonSchedule(start: Date, end: Date): SalonCloudResponse<Array<DailyDayData>> {

        return;
    };

    public getSchedule(start: Date, end: Date): SalonCloudResponse<Array<DailyDayData>> {

        return;
    };

    public updateAppointmentStatus(appointmentId: string, status: number): SalonCloudResponse<AppointmentData> {
        return;
    };

    protected abstract filterAppointmentFields(appointment: AppointmentData): AppointmentData;


}
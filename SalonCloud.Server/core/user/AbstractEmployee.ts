


import { SalonUser } from './SalonUser'
import { EmployeeBehavior } from './EmployeeBehavior'
import { UserProfile } from './../../modules/userManagement/UserData'
import { AppointmentData } from './../../modules/appointmentManagement/AppointmentData'
import { DailyDayData, WeeklyDayData } from './../../modules/schedule/ScheduleData'
import { EmployeeSchedule } from './../../modules/schedule/EmployeeSchedule'
import { SalonSchedule } from './../../modules/schedule/SalonSchedule'
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
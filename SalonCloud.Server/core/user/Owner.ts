


import { AbstractAdministrator } from './AbstractAdministrator'
import { SalonCloudResponse } from './../SalonCloudResponse'
import { UserProfile } from './../../modules/userManagement/UserData'
import { AppointmentData } from './../../modules/appointmentManagement/AppointmentData'
import { DailyDayData, WeeklyDayData } from './../../modules/schedule/ScheduleData'


export class Owner extends AbstractAdministrator {

    public activateEmployee(employeeId: string): SalonCloudResponse<boolean> {

        return;
    };

    public activateSalon(salonId: string): boolean {

        return;

    };

    public addService() {

        return;
    };

    public deactivateEmployee(emplpoyeeId: string): boolean {

        return;
    };

    public deativateSalon(salonId: string): boolean {
        return;
    };

    public removeService() {

        return;
    };

    public updateEmployeeProfile(employee: UserProfile): boolean {

        return;
    };

    public updateSalonDailySchedule(dailySchedule: DailyDayData) {

    };

    public updateSalonInformation(info: SalonInformation): boolean {

    };

    public updateSalonSetting(setting: SalonSetting): boolean {

    };

    public updateSalonWeeklySchedule(weeklySchedule: WeeklyDayData) {

    };

    public updateService() {

    };

    public getSchedule(start: Date, end: Date): SalonCloudResponse<Array<DailyDayData>> {

        return;
    };

    protected filterProfileData(user: UserProfile): UserProfile {

        return;
    }
}
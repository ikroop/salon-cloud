


import {AbstractAdministrator} from './AbstractAdministrator'

export class Owner extends AbstractAdministrator {
    
    public activateEmployee(employeeId : string) : boolean{

    };

    public activateSalon(salonId : string) : boolean{

    };

    public addService(){

    };

    public deactivateEmployee(emplpoyeeId : string) : boolean{

    };

    public deativateSalon(salonId : string) : boolean{

    };

    public removeService(){

    };

    public updateEmployeeProfile(employee : UserProfile) : boolean{

    };

    public updateSalonDailySchedule(dailySchedule : DailySchedule){

    };

    public updateSalonInformation(info : SalonInformation) : boolean{

    };

    public updateSalonSetting(setting : SalonSetting) : boolean{

    };

    public updateSalonWeeklySchedule(weeklySchedule : WeeklySchedule){

    };

    public updateService(){

    };

    public getSchedule(start : Date, end : Date) : SalonCloudResponse<Array<DailySchedule>>{

    };

    protected filterProfileData(user : UserProfile) : UserProfile {

    }
}
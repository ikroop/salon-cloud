/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { ErrorMessage } from './../../../Core/ErrorMessage';
import { DailyScheduleData, WeeklyScheduleData, IDailyScheduleData, IWeeklyScheduleData, WeeklyDayData, DailyDayData } from './../../../Modules/Schedule/ScheduleData'
import { SalonTime } from './../../../Core/SalonTime/SalonTime';
import { SalonCloudResponse } from './../../../Core/SalonCloudResponse';
import { ScheduleManagementDatabaseInterface } from './../ScheduleManagementDatabaseInterface';
import { firebase } from './../../Firebase';
import { firebaseAdmin } from './../../FirebaseAdmin';
import { FirebaseSalonManagement } from './../../SalonDatabase/Firebase/FirebaseSalonManagement';

export class FirebaseScheduleManagement implements ScheduleManagementDatabaseInterface<IDailyScheduleData, IWeeklyScheduleData> {
    private salonId: string;
    private database: any;
    private scheduleRef: any;
    private readonly SCHEDULE_KEY_NAME: string = 'schedule';
    private salonDatabase: FirebaseSalonManagement;
    
    /**
     * Creates an instance of FirebaseScheduleManagement.
     * 
     * @param {string} salonId
     * 
     * @memberOf FirebaseScheduleManagement
     */
    constructor(salonId: string) {
        this.salonId = salonId;
        this.database = firebaseAdmin.database();
        this.salonDatabase = new FirebaseSalonManagement(salonId);
        var salonRef = this.salonDatabase.getSalonFirebaseRef();
        this.scheduleRef = salonRef.ref(salonId + '/' + this.SCHEDULE_KEY_NAME);
    }

    /**
     * 
     * 
     * @param {string} employeeId
     * @returns {Promise<IWeeklyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    public async getWeeklySchedule(employeeId: string): Promise<IWeeklyScheduleData> {
        var weeklySchedule: IWeeklyScheduleData = undefined;
        if (employeeId) {
            weeklySchedule = await this.getEmployeeWeeklySchedule(employeeId);
        } else {
            weeklySchedule = await this.getSalonWeeklySchedule();
        }
        return weeklySchedule;
    }

    /**
     * 
     * 
     * @param {string} employeeId
     * @param {WeeklyDayData[]} weeklyScheduleList
     * @returns {Promise<IWeeklyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    public async updateWeeklySchedule(employeeId: string, weeklyScheduleList: WeeklyDayData[]): Promise<IWeeklyScheduleData> {
        var weeklySchedule: IWeeklyScheduleData = undefined;
        if (employeeId) {
            weeklySchedule = await this.updateEmployeeWeeklySchedule(employeeId, weeklyScheduleList);
        } else {
            weeklySchedule = await this.updateSalonWeeklySchedule(weeklyScheduleList);
        }
        return weeklySchedule;
    }
    
    /**
     * 
     * 
     * @param {string} employeeId
     * @param {WeeklyDayData[]} weeklyScheduleList
     * @returns {Promise<IWeeklyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    public async saveWeeklySchedule(employeeId: string, weeklyScheduleList: WeeklyDayData[]): Promise<IWeeklyScheduleData> {
        var weeklySchedule: IWeeklyScheduleData = undefined;
        if (employeeId) {
            weeklySchedule = await this.saveEmployeeWeeklySchedule(employeeId, weeklyScheduleList);
        } else {
            weeklySchedule = await this.saveSalonWeeklySchedule(weeklyScheduleList);
        }
        return weeklySchedule;
    }

    public async getDailySchedule(employeeId: string, startDate: SalonTime, endDate: SalonTime): Promise<IDailyScheduleData[]> {

        return;
    }

    public async updateDailySchedule(employeeId: string, dailySchedule: DailyDayData): Promise<IDailyScheduleData> {


        return;

    }
    public async saveDailySchedule(employeeId: string, dailySchedule: DailyDayData): Promise<IDailyScheduleData> {
        return;
    }

    /**
     * 
     * 
     * @private
     * @param {string} employeeId
     * @returns {Promise<IWeeklyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    private async getEmployeeWeeklySchedule(employeeId: string): Promise<IWeeklyScheduleData> {
        var employeeWeeklySchedule: IWeeklyScheduleData = undefined;
        await this.scheduleRef.ref('weekly/employees/' + employeeId).orderByChild('day_of_week').once('value', async function (snapshot) {
            employeeWeeklySchedule = snapshot.val();
        });
        return employeeWeeklySchedule;
    }

    /**
     * 
     * 
     * @private
     * @returns {Promise<IWeeklyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    private async getSalonWeeklySchedule(): Promise<IWeeklyScheduleData> {
        var salonWeeklySchedule: IWeeklyScheduleData = undefined;
        await this.scheduleRef.ref('weekly/salon').orderByChild('day_of_week').once('value', async function (snapshot) {
            salonWeeklySchedule = snapshot.val();
        });
        return salonWeeklySchedule;
    }

    /**
     * 
     * 
     * @private
     * @param {string} employeeId
     * @param {WeeklyDayData[]} weeklyScheduleList
     * @returns {Promise<IWeeklyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    private async updateEmployeeWeeklySchedule(employeeId: string, weeklyScheduleList: WeeklyDayData[]): Promise<IWeeklyScheduleData> {
        var employeeWeeklySchedule: IWeeklyScheduleData = undefined;
        await this.scheduleRef.ref('weekly/employees/' + employeeId).update(weeklyScheduleList);
        employeeWeeklySchedule = await this.getEmployeeWeeklySchedule(employeeId);
        return employeeWeeklySchedule;
    }

    /**
     * 
     * 
     * @private
     * @param {WeeklyDayData[]} weeklyScheduleList
     * @returns {Promise<IWeeklyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    private async updateSalonWeeklySchedule(weeklyScheduleList: WeeklyDayData[]): Promise<IWeeklyScheduleData> {
        var salonWeeklySchedule: IWeeklyScheduleData = undefined;
        await this.scheduleRef.ref('weekly/salon').update(weeklyScheduleList);
        salonWeeklySchedule = await this.getSalonWeeklySchedule();
        return salonWeeklySchedule;
    }

    /**
     * 
     * 
     * @private
     * @param {string} employeeId
     * @param {WeeklyDayData[]} weeklyScheduleList
     * @returns {Promise<IWeeklyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    private async saveEmployeeWeeklySchedule(employeeId: string, weeklyScheduleList: WeeklyDayData[]): Promise<IWeeklyScheduleData> {
        var employeeWeeklySchedule: IWeeklyScheduleData = undefined;
        await this.scheduleRef.ref('weekly/employees/' + employeeId).save(weeklyScheduleList);
        employeeWeeklySchedule = await this.getEmployeeWeeklySchedule(employeeId);
        return employeeWeeklySchedule;
    }

    /**
     * 
     * 
     * @private
     * @param {string} employeeId
     * @param {WeeklyDayData[]} weeklyScheduleList
     * @returns {Promise<IWeeklyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    private async saveSalonWeeklySchedule(weeklyScheduleList: WeeklyDayData[]): Promise<IWeeklyScheduleData> {
        var salonWeeklySchedule: IWeeklyScheduleData = undefined;
        await this.scheduleRef.ref('weekly/salon').save(weeklyScheduleList);
        salonWeeklySchedule = await this.getSalonWeeklySchedule();
        return salonWeeklySchedule;
    }
}
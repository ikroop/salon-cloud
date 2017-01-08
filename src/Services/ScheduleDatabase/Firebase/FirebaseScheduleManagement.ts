/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { ErrorMessage } from './../../../Core/ErrorMessage';
import { DailyScheduleData, WeeklyScheduleData, IDailyScheduleData, IWeeklyScheduleData, WeeklyDayData, DailyDayData } from './../../../Modules/Schedule/ScheduleData'
import { SalonTime } from './../../../Core/SalonTime/SalonTime';
import { SalonTimeData } from './../../../Core/SalonTime/SalonTimeData';
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
        this.scheduleRef = salonRef.child(salonId + '/' + this.SCHEDULE_KEY_NAME);
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
        var weeklySchedule: IWeeklyScheduleData = null;
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
        var weeklySchedule: IWeeklyScheduleData = null;
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
        var weeklySchedule: IWeeklyScheduleData = null;
        if (employeeId) {
            weeklySchedule = await this.saveEmployeeWeeklySchedule(employeeId, weeklyScheduleList);
        } else {
            weeklySchedule = await this.saveSalonWeeklySchedule(weeklyScheduleList);
        }
        return weeklySchedule;
    }

    /**
     * 
     * 
     * @param {string} employeeId
     * @param {SalonTimeData} startDate
     * @param {SalonTimeData} endDate
     * @returns {Promise<IDailyScheduleData[]>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    public async getDailySchedule(employeeId: string, startDate: SalonTimeData, endDate: SalonTimeData): Promise<IDailyScheduleData[]> {
        var dailySchedule: IDailyScheduleData[] = null;
        if (employeeId) {
            dailySchedule = await this.getEmployeeDailychedule(employeeId, startDate, endDate);
        } else {
            dailySchedule = await this.getSalonDailychedule(startDate, endDate);
        }
        return dailySchedule;
    }

    /**
     * 
     * 
     * @param {string} employeeId
     * @param {DailyDayData} dailySchedule
     * @returns {Promise<IDailyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    public async updateDailySchedule(employeeId: string, dailySchedule: DailyDayData): Promise<IDailyScheduleData> {

        var rs: IDailyScheduleData = null;
        if (employeeId) {
            rs = await this.updateEmployeeDailySchedule(employeeId, dailySchedule);
        } else {
            rs = await this.updateSalonDailySchedule(dailySchedule);
        }
        return rs;

    }

    /**
     * 
     * 
     * @param {string} employeeId
     * @param {DailyDayData} dailySchedule
     * @returns {Promise<IDailyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    public async saveDailySchedule(employeeId: string, dailySchedule: DailyDayData): Promise<IDailyScheduleData> {
        var dailyScheduleReturn: IDailyScheduleData = null;

        // convert SalonTime to SalonTimeData JSON
        dailySchedule.date = SalonTime.exportJSON(dailySchedule.date);

        if (employeeId) {
            dailyScheduleReturn = await this.saveEmployeeDailySchedule(employeeId, dailySchedule);
        } else {
            dailyScheduleReturn = await this.saveSalonDailySchedule(dailySchedule);
        }
        return dailyScheduleReturn;
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
        var employeeWeeklySchedule: IWeeklyScheduleData = {
            salon_id: this.salonId,
            employee_id: null,
            week: null
        };
        await this.scheduleRef.child('weekly/employees/' + employeeId).once('value', function (snapshot) {
            var weekScheduleArray: WeeklyDayData[] = snapshot.val();
            employeeWeeklySchedule.week = weekScheduleArray;
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
        var salonWeeklySchedule: IWeeklyScheduleData = {
            salon_id: this.salonId,
            employee_id: null,
            week: null
        };
        await this.scheduleRef.child('weekly/salon').once('value', function (snapshot) {
            var weekScheduleArray: WeeklyDayData[] = snapshot.val();
            salonWeeklySchedule.week = weekScheduleArray;
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
        var employeeWeeklySchedule: IWeeklyScheduleData = null;
        //Passing an Array to Firebase.update() is deprecated. 
        //Use set() if you want to overwrite the existing data, or 
        //an Object with integer keys if you really do want to only update some of the children
        await this.scheduleRef.child('weekly/employees/' + employeeId).set(weeklyScheduleList);
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
        var salonWeeklySchedule: IWeeklyScheduleData = null;
        //Passing an Array to Firebase.update() is deprecated. 
        //Use set() if you want to overwrite the existing data, or 
        //an Object with integer keys if you really do want to only update some of the children
        try {
            await this.scheduleRef.child('weekly/salon').set(weeklyScheduleList);
            salonWeeklySchedule = await this.getSalonWeeklySchedule();
        } catch (error) {
            console.log(error);
            throw error;
        }
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
        var employeeWeeklySchedule: IWeeklyScheduleData = null;
        await this.scheduleRef.child('weekly/employees/' + employeeId).set(weeklyScheduleList);
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
        var salonWeeklySchedule: IWeeklyScheduleData = null;
        try {
            await this.scheduleRef.child('weekly/salon').set(weeklyScheduleList);
            salonWeeklySchedule = await this.getSalonWeeklySchedule();
        } catch (error) {
            throw error;
        }
        return salonWeeklySchedule;
    }

    /**
     * 
     * 
     * @private
     * @param {string} employeeId
     * @param {SalonTimeData} startDate
     * @param {SalonTimeData} endDate
     * @returns {Promise<IDailyScheduleData[]>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    private async getEmployeeDailychedule(employeeId: string, startDate: SalonTimeData, endDate: SalonTimeData): Promise<IDailyScheduleData[]> {
        var employeeDailyScheduleList: IDailyScheduleData[] = new Array();
        try {
            await this.scheduleRef.child('daily/employees/' + employeeId).orderByChild('date/timestamp').startAt(startDate.timestamp).endAt(endDate.timestamp).once('value', async function (snapshot) {
                var employeeDailySchedule: IDailyScheduleData = snapshot.val();
                if (employeeDailySchedule) {
                    employeeDailySchedule._id = snapshot.key;
                    employeeDailyScheduleList.push(employeeDailySchedule);
                }
            });
        } catch (error) {
            throw error;
        }
        return employeeDailyScheduleList;
    }

    /**
     * 
     * 
     * @private
     * @param {SalonTimeData} startDate
     * @param {SalonTimeData} endDate
     * @returns {Promise<IDailyScheduleData[]>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    private async getSalonDailychedule(startDate: SalonTimeData, endDate: SalonTimeData): Promise<IDailyScheduleData[]> {
        var salonDailyScheduleList: IDailyScheduleData[] = new Array();
        try {
            await this.scheduleRef.child('daily/salon').orderByChild('date/timestamp').startAt(startDate.timestamp).endAt(endDate.timestamp).once('value', async function (snapshot) {
                var salonDailySchedule: IDailyScheduleData = snapshot.val();
                if (salonDailySchedule) {
                    salonDailySchedule._id = snapshot.key;
                    salonDailyScheduleList.push(salonDailySchedule);
                }
            });
        } catch (error) {
            throw error;
        }
        return salonDailyScheduleList;
    }

    /**
     * 
     * 
     * @param {string} employeeId
     * @param {DailyDayData} dailySchedule
     * @returns {Promise<IDailyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    public async saveEmployeeDailySchedule(employeeId: string, dailySchedule: DailyDayData): Promise<IDailyScheduleData> {
        var employeeDailySchedule: IDailyScheduleData = null;
        try {
            await this.scheduleRef.child('daily/employees/' + employeeId).push().set(dailySchedule);
            employeeDailySchedule = (await this.getEmployeeDailychedule(employeeId, dailySchedule.date, dailySchedule.date))[0];
        } catch (error) {
            throw error;
        }
        return employeeDailySchedule;
    }

    /**
     * 
     * 
     * @param {DailyDayData} dailySchedule
     * @returns {Promise<IDailyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    public async saveSalonDailySchedule(dailySchedule: DailyDayData): Promise<IDailyScheduleData> {
        var employeeDailySchedule: IDailyScheduleData = null;

        try {
            await this.scheduleRef.child('daily/salon').push().set(dailySchedule);
            employeeDailySchedule = (await this.getSalonDailychedule(dailySchedule.date, dailySchedule.date))[0];
        } catch (error) {
            throw error;
        }
        return employeeDailySchedule;
    }

    /**
     * 
     * 
     * @param {string} employeeId
     * @param {DailyDayData} dailySchedule
     * @returns {Promise<IDailyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    public async updateEmployeeDailySchedule(employeeId: string, dailySchedule: DailyDayData): Promise<IDailyScheduleData> {
        var oldDailyScheduleList = await this.getEmployeeDailychedule(employeeId, dailySchedule.date, dailySchedule.date);
        var oldDailySchedule = oldDailyScheduleList[0];
        await this.scheduleRef.child('daily/employees/' + employeeId + '/' + oldDailySchedule._id).set(dailySchedule);
        var newDailyScheduleList = await this.getEmployeeDailychedule(employeeId, dailySchedule.date, dailySchedule.date);
        return newDailyScheduleList[0];
    }

    /**
     * 
     * 
     * @param {string} employeeId
     * @param {DailyDayData} dailySchedule
     * @returns {Promise<IDailyScheduleData>}
     * 
     * @memberOf FirebaseScheduleManagement
     */
    public async updateSalonDailySchedule(dailySchedule: DailyDayData): Promise<IDailyScheduleData> {
        var oldDailyScheduleList = await this.getSalonDailychedule(dailySchedule.date, dailySchedule.date);
        var oldDailySchedule = oldDailyScheduleList[0];
        await this.scheduleRef.child('daily/salon/' + oldDailySchedule._id).set(dailySchedule);
        var newDailyScheduleList = await this.getSalonDailychedule(dailySchedule.date, dailySchedule.date);
        return newDailyScheduleList[0];
    }

}
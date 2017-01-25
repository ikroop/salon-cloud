/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { SalonCloudResponse } from './../../../Core/SalonCloudResponse';
import { ErrorMessage } from './../../../Core/ErrorMessage';
import { AppointmentData, AppointmentItemData, IAppointmentData } from './../../../Modules/AppointmentManagement/AppointmentData';
import { mongoose } from './../../Database';
import { SalonTimeData } from './../../../Core/SalonTime/SalonTimeData';
import { SalonTime } from './../../../Core/SalonTime/SalonTime';
import { FirebaseSalonManagement } from './../../SalonDatabase/Firebase/FirebaseSalonManagement';

import { AppointmentManagementDatabaseInterface } from './../AppointmentManagementDatabaseInterface';
import { firebase } from './../../Firebase';
import { firebaseAdmin } from './../../FirebaseAdmin';

export class FirebaseAppointmentManagement implements AppointmentManagementDatabaseInterface<IAppointmentData> {
    private salonId: string;
    private database: any;
    private appointmentRef: any;
    private appointmentItemsRef: any;

    private readonly APPOINTMENT_KEY_NAME: string = 'appointment';
    private readonly APPOINTMENT_ITEMS_KEY_NAME: string = 'appointment_items';

    private salonDatabase: FirebaseSalonManagement;

    /**
     * Creates an instance of FirebaseAppointmentManagement.
     * 
     * @param {string} salonId
     * 
     * @memberOf FirebaseAppointmentManagement
     */
    constructor(salonId: string) {
        this.salonId = salonId;
        this.database = firebaseAdmin.database();
        this.salonDatabase = new FirebaseSalonManagement(salonId);
        var salonRef = this.salonDatabase.getSalonFirebaseRef();
        this.appointmentRef = salonRef.child(salonId + '/' + this.APPOINTMENT_KEY_NAME);
        this.appointmentItemsRef = salonRef.child(salonId + '/' + this.APPOINTMENT_ITEMS_KEY_NAME);
    }

    /**
     * 
     * 
     * @param {AppointmentData} appointment
     * @returns {Promise<IAppointmentData>}
     * 
     * @memberOf FirebaseAppointmentManagement
     */
    public async createAppointment(appointment: AppointmentData): Promise<IAppointmentData> {
        var createdAppointment: IAppointmentData = null;
        var appointmentItemList: Array<AppointmentItemData> = [];
        for (var eachItem of appointment.appointment_items) {
            appointmentItemList.push(eachItem);

        }
        appointment.appointment_items = null;
        //appointment.appointment_items = null;
        try {
            createdAppointment = await this.saveAppointmentInformation(appointment);
            await this.saveAppointmentItems(createdAppointment._id, appointmentItemList);
            createdAppointment.appointment_items
        } catch (error) {
            throw error;
        }
        return createdAppointment;
    }

    public async getEmployeeAppointmentByDate(employeeId: string, date: SalonTimeData): Promise<AppointmentItemData[]> {
        var appointmentItemList: AppointmentItemData[] = new Array();
        var targetDate = new SalonTime(date);
        targetDate.setToBeginningDate();
        var beginDate = targetDate.timestamp;
        var testDay = new Date(Date.UTC(targetDate.year, targetDate.month, targetDate.day));
        var endDate = targetDate.timestamp + 24 * 3600 * 1000;

        try {
            await this.appointmentItemsRef.orderByChild('start/timestamp').startAt(beginDate).endAt(endDate).once('value', function (snapshot) {
                var appointmentItem: AppointmentItemData = snapshot.val();

                if (appointmentItem) {

                    for (var eachItem in appointmentItem)
                        if (appointmentItem.hasOwnProperty(eachItem)) {
                            if (appointmentItem[eachItem].employee_id === employeeId) {
                                appointmentItemList.push(appointmentItem[eachItem]);
                            }
                        }
                }
            });
        } catch (error) {
            throw error;
        }
        return appointmentItemList;
    }

    private async saveAppointmentInformation(appointment: AppointmentData): Promise<IAppointmentData> {
        var createdAppointment: IAppointmentData = null;

        try {
            var newAppointmentRef = await this.appointmentRef.push();
            await newAppointmentRef.set(appointment);
            createdAppointment = appointment;
            createdAppointment._id = newAppointmentRef.key;
        } catch (error) {
            throw error;
        }
        return createdAppointment;
    }

    private async saveAppointmentItems(appointmentId: string, appointmentItemList: AppointmentItemData[]): Promise<void> {
        var baseAppointmentItemRef = this.appointmentItemsRef
        appointmentItemList.forEach(async item => {
            try {
                item.end = SalonTime.exportJSON(item.end);
                item.start = SalonTime.exportJSON(item.start);
                item.appointment_id = appointmentId;

                var newAppointmentItemRef = await baseAppointmentItemRef.push();
                await newAppointmentItemRef.set(item);
            } catch (error) {
                throw error;
            }
        });
    }

}
/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { SalonCloudResponse } from './../../../Core/SalonCloudResponse';
import { ErrorMessage } from './../../../Core/ErrorMessage';
import { AppointmentData, AppointmentItemData, IAppointmentData } from './../../../Modules/AppointmentManagement/AppointmentData';
import { mongoose } from './../../Database';

import { AppointmentManagementDatabaseInterface } from './../AppointmentManagementDatabaseInterface';
import { firebase } from './../../Firebase';
import { firebaseAdmin } from './../../FirebaseAdmin';

export class FirebaseAppointmentManagement implements AppointmentManagementDatabaseInterface<IAppointmentData> {
    private salonId: string;
    private database: any;
    private salonRef: any;
    private readonly SALON_KEY_NAME: string = 'salons';
    private readonly SALON_PROFILE_KEY_NAME: string = 'profile';
    /**
     * Creates an instance of MongoSalonManagement.
     * 
     * @param {string} salonId
     * 
     * @memberOf MongoSalonManagement
     */
    constructor(salonId: string) {
        this.salonId = salonId;
        try {
            this.database = firebaseAdmin.database();
            this.salonRef = this.database.ref(this.SALON_KEY_NAME);
        } catch (error) {
            console.error('error:', error);
        }
    }
    
}
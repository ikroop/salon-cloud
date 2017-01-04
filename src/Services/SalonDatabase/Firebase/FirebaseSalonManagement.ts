/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { SalonCloudResponse } from './../../../Core/SalonCloudResponse';
import { ErrorMessage } from './../../../Core/ErrorMessage';
import { SalonData, ISalonData } from './../../../Modules/SalonManagement/SalonData'
import { mongoose } from './../../Database';

import { SalonManagementDatabaseInterface } from './../SalonManagementDatabaseInterface';
import { firebase } from './../../Firebase';
import { firebaseAdmin } from './../../FirebaseAdmin';

export class FirebaseSalonManagement implements SalonManagementDatabaseInterface<ISalonData> {
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


    /**
     * 
     * 
     * @param {SalonData} salon
     * @returns {Promise<ISalonData>}
     * 
     * @memberOf FirebaseSalonManagement
     */
    public async createSalon(salon: SalonData): Promise<ISalonData> {
        var salonDatabase: ISalonData = salon;

        // FIX ME: server crash
        //salonDatabase.created_at = this.database.ServerValue.TIMESTAMP;

        try {
            var newSalonRef = await this.salonRef.push();
            var profile = {
                'profile': salonDatabase
            }
            await newSalonRef.set(profile);
            salonDatabase._id = newSalonRef.key;
        } catch (error) {
            console.log('error:', error);
        }

        return salonDatabase;
    }


    /**
     * 
     * 
     * @param {string} id
     * @returns {Promise<ISalonData>}
     * 
     * @memberOf FirebaseSalonManagement
     */
    public async getSalonById(): Promise<ISalonData> {
        var salonDatabase: ISalonData = undefined;
        var salonId = this.salonId;
        var salonProfileRef = this.salonRef.child(this.salonId + '/profile');
        await salonProfileRef.once('value', function (snapshot) {
            salonDatabase = snapshot.val();
            if (salonDatabase) {
                salonDatabase._id = salonId;
            }
        }, function (errorObject) {
            throw errorObject;
        });

        return salonDatabase;
    }
}
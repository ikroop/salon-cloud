/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { ErrorMessage } from './../../../Core/ErrorMessage';
import { SalonCloudResponse } from './../../../Core/SalonCloudResponse';
import { VerificationDatabaseInterface } from './../VerificationDatabaseInterface';
import { IVerificationData, VerificationData } from './../../../Core/Verification/VerificationData'
import { SalonTime } from './../../../Core/SalonTime/SalonTime';

import { firebase } from './../../Firebase';
import { firebaseAdmin } from './../../FirebaseAdmin';
import { FirebaseSalonManagement } from './../../SalonDatabase/Firebase/FirebaseSalonManagement';

export class FirebaseVerification implements VerificationDatabaseInterface {
    private salonId: string;
    private database: any;
    private verificationRef: any;
    private readonly VERIFICATION_KEY_NAME: string = 'verifications';
    /**
     * Creates an instance of MongoSalonManagement.
     * 
     * @param {string} salonId
     * 
     * @memberOf MongoSalonManagement
     */
    constructor() {
        this.database = firebaseAdmin.database();
        this.verificationRef = this.database.ref(this.VERIFICATION_KEY_NAME);
    }

    /**
     * Generate verification code 
     * 
     * @param {string} phone
     * @param {string} code
     * @returns {Promise<IVerificationData>}
     * 
     * @memberOf FirebaseVerification
     */
    public async generateVerification(phone: string, code: string): Promise<IVerificationData> {
        var verificationObject: IVerificationData = {
            phone: phone,
            code: code,
            timestamp: SalonTime.getUTCTimestamp(),
            activated: false
        }

        try {
            var newVerificationRef = await this.verificationRef.push();

            await newVerificationRef.set(verificationObject);
            verificationObject._id = newVerificationRef.key;
        } catch (error) {
            console.log('error:', error);
        }

        return verificationObject;
    }

    /**
     * Verify code
     * 
     * @param {string} id
     * @param {string} phone
     * @param {string} code
     * @returns {Promise<IVerificationData>}
     * 
     * @memberOf FirebaseVerification
     */
    public async getVerification(id: string, phone: string, code: string): Promise<IVerificationData> {

        var verification: IVerificationData = null;
        try {
            await this.verificationRef.child(id).orderByChild('code').equalTo(code).once('value', function (snapshot) {
                var object = snapshot.val();
                if (object && object.phone === phone) {
                    verification = object;
                    verification._id = id;
                }
            });
        } catch (error) {
            throw error;
        }
        return verification;
    }
}



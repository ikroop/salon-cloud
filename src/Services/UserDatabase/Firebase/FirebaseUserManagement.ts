/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { ErrorMessage } from './../../../Core/ErrorMessage';
import { UserData, IUserData, UserProfile } from './../../../Modules/UserManagement/UserData'
import { SalonCloudResponse } from './../../../Core/SalonCloudResponse';

import { UserManagementDatabaseInterface } from './../UserManagementDatabaseInterface';
import { firebase } from './../../Firebase';
import { firebaseAdmin } from './../../FirebaseAdmin';

export class FirebaseUserManagement implements UserManagementDatabaseInterface<IUserData> {
    private salonId: string;
    private database: any;
    private userRef: any;
    private readonly USER_KEY_NAME: string = 'users';
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
            this.userRef = this.database.ref(this.USER_KEY_NAME);
        } catch (error) {
            console.error('error:', error);
        }
    }

    /**
     * 
     * 
     * @param {string} userId
     * @param {string} salonId
     * @returns {Promise<IUserData>}
     * 
     * @memberOf MongoUserManagement
     */
    public async getUserById(userId: string, salonId: string): Promise<IUserData> {
        return;
    }


    /**
     * 
     * 
     * @param {string} phone
     * @param {string} salonId
     * @returns {Promise<IUserData>}
     * 
     * @memberOf MongoUserManagement
     */
    public async getUserByPhone(phone: string, salonId: string): Promise<IUserData> {
        return;
    }

    /**
     * 
     * 
     * @param {string} userId
     * @param {UserData} userData
     * 
     * @memberOf FirebaseUserManagement
     */
    public async addUserData(userId: string, userData: UserData): Promise<void> {
        try {
            await this.userRef.child(userId).set(userData);
        } catch (error) {
            console.log('error:', error);
        }
    }

    /**
     * 
     * 
     * @param {string} userId
     * @param {UserProfile} userProfile
     * @returns {Promise<SalonCloudResponse<UserProfile>>}
     * 
     * @memberOf MongoUserManagement
     */
    public async createProfile(userId: string, userProfile: UserProfile): Promise<SalonCloudResponse<UserProfile>> {

        //Find user by user id

        return;
    }

    /**
     * 
     * 
     * @param {string} salonId
     * @returns {Promise<IUserData[]>}
     * 
     * @memberOf MongoUserManagement
     */
    public async getAllEmployees(salonId: string): Promise<IUserData[]> {
        return;
    }
}
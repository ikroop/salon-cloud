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
import { FirebaseSalonManagement } from './../../SalonDatabase/Firebase/FirebaseSalonManagement';

export class FirebaseUserManagement implements UserManagementDatabaseInterface<IUserData> {
    private salonId: string;
    private database: any;
    private userRef: any;
    private readonly USER_KEY_NAME: string = 'users';
    private salonDatabase: FirebaseSalonManagement;
    /**
     * Creates an instance of MongoSalonManagement.
     * 
     * @param {string} salonId
     * 
     * @memberOf MongoSalonManagement
     */
    constructor(salonId: string) {
        this.salonId = salonId;
        this.database = firebaseAdmin.database();
        this.salonDatabase = new FirebaseSalonManagement(salonId);
        var salonRef = this.salonDatabase.getSalonFirebaseRef();
        this.userRef = this.database.ref(this.USER_KEY_NAME);
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
    public async getUserById(userId: string): Promise<IUserData> {
        var userDatabase: IUserData = null;
        try {
            userDatabase = await this.getUserDataById(userId);
            var profile = await this.getUserProfile(userId);
            if (profile) {
                userDatabase.profile = [];
                userDatabase.profile.push(profile);
            }

        } catch (error) {
            throw error
        }
        return userDatabase;
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
    public async getUserByPhone(phone: string): Promise<IUserData> {
        var userDatabase: IUserData = null;
        userDatabase = await this.getUserDataByPhone(phone);
        if (userDatabase) {
            var profile = await this.getUserProfile(userDatabase._id);
            userDatabase.profile = [];

            if (profile) {
                userDatabase.profile.push(profile);
            }
        }

        return userDatabase;
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
        var returnResult: SalonCloudResponse<UserProfile> = {
            code: null,
            data: null,
            err: null
        };
        try {
            // create salon user Profile
            var salonRef = this.salonDatabase.getSalonFirebaseRef();
            await salonRef.child(this.salonId + '/users/' + userId).set(userProfile);
            returnResult.code = 200;
            returnResult.data = userProfile;
        } catch (error) {
            returnResult.code = 500;
            returnResult.err = ErrorMessage.ServerError;
        }
        return returnResult;
    }

    /**
     * 
     * 
     * @param {string} salonId
     * @returns {Promise<IUserData[]>}
     * 
     * @memberOf MongoUserManagement
     */
    public async getAllEmployees(): Promise<IUserData[]> {
        var emplpoyeeList: IUserData[] = [];
        var salonRef = this.salonDatabase.getSalonFirebaseRef();

        //get User Salon Profile which is employee.
        await salonRef.child('users').orderByChild('role').startAt(2).endAt(3).once('value', function (snapshot) {
            var userProfile: UserProfile = snapshot.val();
            var uid = snapshot.key;
            var userData: IUserData = null;

            //FIX ME: check data is overwrited or not.    
            //get User Data
            this.userRef.child(uid).once('value', function (snapshot) {
                userData = snapshot.val();
                userData._id = uid;
                userData.profile.push(userProfile);
                emplpoyeeList.push(userData);
            });
        }, function (errorObject) {
            throw errorObject;
        });

        return emplpoyeeList;
    }

    /**
     * 
     * 
     * @private
     * @param {string} phone
     * @returns {Promise<IUserData>}
     * 
     * @memberOf FirebaseUserManagement
     */
    private async getUserDataByPhone(phone: string): Promise<IUserData> {
        var userDatabase: IUserData = null;
        if (!phone) {
            return null;
        }
        try {
            await this.userRef.orderByChild('phone').equalTo(phone).once('value', function (snapshot) {
                var object = snapshot.val();
                if (object) {
                    var id = Object.keys(object)[0];
                    userDatabase = object[id];
                    userDatabase._id = id;
                }
            });
        } catch (error) {
            throw error;
        }
        return userDatabase;
    }

    /**
     * 
     * 
     * @private
     * @param {string} userId
     * @returns {Promise<IUserData>}
     * 
     * @memberOf FirebaseUserManagement
     */
    private async getUserDataById(userId: string): Promise<IUserData> {
        var userDatabase: IUserData = null;
        await this.userRef.child(userId).once('value', function (snapshot) {
            userDatabase = snapshot.val();
            if (userDatabase) {
                userDatabase._id = userId;
            }
        }, function (errorObject) {
            throw errorObject;
        });
        return userDatabase;
    }

    /**
     * 
     * 
     * @private
     * @param {string} userId
     * @returns {Promise<UserProfile>}
     * 
     * @memberOf FirebaseUserManagement
     */
    private async getUserProfile(userId: string): Promise<UserProfile> {
        var userProfile: UserProfile = null;
        var salonRef = this.salonDatabase.getSalonFirebaseRef();
        await salonRef.child(this.salonId + '/users/' + userId).once('value', function (snapshot) {
            userProfile = snapshot.val();
        }, function (errorObject) {
            throw errorObject;
        });

        return userProfile;
    }
}
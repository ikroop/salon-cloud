/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { ErrorMessage } from './../../../Core/ErrorMessage';
import { UserData, IUserData, UserProfile } from './../../../Modules/UserManagement/UserData'
import UserModel = require('./UserModel');
import { SalonCloudResponse } from './../../../Core/SalonCloudResponse';

import { UserManagementDatabaseInterface } from './../UserManagementDatabaseInterface';

export class MongoUserManagement implements UserManagementDatabaseInterface<IUserData> {
    private salonId: string;


    /**
     * Creates an instance of MongoUserManagement.
     * 
     * @param {string} salonId
     * 
     * @memberOf MongoUserManagement
     */
    constructor(salonId: string) {
        this.salonId = salonId;
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
        var user: IUserData = null;

        await UserModel.findOne({ "_id": userId }, { "profile": { "$elemMatch": { "salon_id": this.salonId } } }, ).exec(function (err, docs: IUserData) {
            if (!err) {
                user = docs;
            } else {
                throw err;
            }
        });

        return user;
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
        var user: IUserData = null;
        await UserModel.findOne({ "username": phone }, { "profile": { "$elemMatch": { "salon_id": this.salonId } } }, ).exec(function (err, docs: IUserData) {
            if (!err) {
                user = docs;
            } else {
                throw err;
            }
        });
        return user;
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

        var userDocs = UserModel.findOne({ '_id': userId }).exec();

        await userDocs.then(async function (docs) {
            if (docs) {
                var checkExistArray = docs.profile.filter(profile => profile.salon_id === userProfile.salon_id);

                if (checkExistArray.length == 0) {
                    docs.profile.push(userProfile);
                    var saveAction = docs.save();
                    await saveAction.then(function (innerDocs) {
                        returnResult.data = userProfile;
                        returnResult.code = 200;

                    }, function (err) {
                        returnResult.err = err;
                        returnResult.code = 500;
                    });

                } else {
                    returnResult.err = ErrorMessage.ProfileAlreadyExist;
                    returnResult.code = 400;
                }
            } else {
                returnResult.err = ErrorMessage.UserNotFound;
                returnResult.code = 404;

            }
        }, function (err) {
            returnResult.err = err;
            returnResult.code = 500;
        })

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
        var rs: IUserData[] = null;
        var userSearch = UserModel.find({ 'profile.salon_id': this.salonId, 'profile.status': true, 'profile.role': { $in: [2, 3] } }).exec();
        await userSearch.then(function (docs) {
            rs = docs;
        }, function (err) {
            throw err;
        });

        return rs;
    }
}
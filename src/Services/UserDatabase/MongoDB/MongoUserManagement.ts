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

export class MongoUserManagement<IUserData> implements UserManagementDatabaseInterface<IUserData> {

    public async getUserById(userId: string, salonId: string): Promise<IUserData> {
        var user: IUserData = undefined;
        try {
            await UserModel.findOne({ "_id": userId }, { "profile": { "$elemMatch": { "salon_id": salonId } } }, ).exec(function (err, docs: IUserData) {
                if (!err) {
                    user = docs;
                } else {
                    user = undefined;
                }
            });
        } catch (e) {
            user = undefined;
        }
        return user;
    }

    public async getUserByPhone(phone: string, salonId: string): Promise<IUserData> {
        var user: IUserData = undefined;
        await UserModel.findOne({ "username": phone }, { "profile": { "$elemMatch": { "salon_id": salonId } } }, ).exec(function (err, docs: IUserData) {
            if (!err) {
                user = docs;
            } else {
                user = undefined;
            }
        });
        return user;
    }

    public async createProfile(userId: string, userProfile: UserProfile): Promise<SalonCloudResponse<UserProfile>> {
        var returnResult: SalonCloudResponse<UserProfile> = {
            code: undefined,
            data: undefined,
            err: undefined
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

    public async getAllEmployees(salonId: string): Promise<IUserData[]>{
        var rs: IUserData[] = undefined;
         var userSearch = UserModel.find({ 'profile.salon_id': salonId, 'profile.status': true, 'profile.role': { $in: [2, 3] } }).exec();
        await userSearch.then(function (docs) {
            rs = docs;
        }, function (err) {
            rs = undefined;
        });

        return rs;
    }
}
// import * as mongoose from "mongoose";
// import {UserProfileSchema} from '../../user/UserProfile';

export class Schedule {
    private id: string;
    private close: number;
    private open: number;
    private status: boolean;
    /*
    constructor() {
        this.UserId = UserId;
        this.SalonId = SalonId;
    }
    createProfile(profileData: UserProfile, callback) {
        UserModel.findOne({ "_id": this.UserId }, function (err, docs) {
            if (err) {
                callback(undefined);
            }
            if (docs) {
                docs.profile.push(profileData);    
                docs.save();
                callback(docs);    
            }
        });
    }*/
}
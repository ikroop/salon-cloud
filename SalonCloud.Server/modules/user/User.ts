//
//
//
//
import * as mongoose from "mongoose";
import {UserProfile} from "./UserProfile";
import {AuthenticationSchema} from "./../../core/authentication/Authentication";

var UserModel = mongoose.model('User', AuthenticationSchema);

export class User {
    private UserId: string;
    private SalonId: string;
    public static SALON_OWNER_ROLE = 1;
    public static SALON_MANAGER_ROLE = 2;
    public static SALON_TECHNICIAN_ROLE = 3;
    public static SALON_CUSTOMER_ROLE = 4;

    constructor(SalonId: string, UserId: string) {
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
    }
}
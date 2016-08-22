"use strict";
//
//
//
//
const mongoose = require("mongoose");
const Authentication_1 = require("./../../core/authentication/Authentication");
var UserModel = mongoose.model('User', Authentication_1.AuthenticationSchema);
class User {
    constructor(SalonId, UserId) {
        this.UserId = UserId;
        this.SalonId = SalonId;
    }
    createProfile(profileData, callback) {
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
User.SALON_OWNER_ROLE = 1;
User.SALON_MANAGER_ROLE = 2;
User.SALON_TECHNICIAN_ROLE = 3;
User.SALON_CUSTOMER_ROLE = 4;
exports.User = User;
//# sourceMappingURL=User.js.map
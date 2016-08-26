/**
 * 
 * 
 * 
 */
import {SalonProfile} from './SalonProfile';
import {User} from './../User/User';
var ErrorMessage = require('./../../routes/ErrorMessage');
import {Validator} from '../../core/validator/Validator';
import SalonModel = require("./SalonModel");

export class Salon {
    private UserId: string;
    private SalonId: string;
    constructor(UserId: string) {
        this.UserId = UserId;
    }
    createSalonInformation(SalonProfileData: SalonProfile, callback) {

        if (!SalonProfileData.information.salon_name) {
            callback(ErrorMessage.MissingSalonName, 400, undefined);
            return;
        }
        if (!SalonProfileData.information.location.address) {
            callback(ErrorMessage.MissingAddress, 400, undefined);
            return;
        } else {
            if (!Validator.IsAdress(SalonProfileData.information.location.address)) {
                callback(ErrorMessage.WrongAddressFormat, 400, undefined);
                return;
            }
        }

        if (!SalonProfileData.information.phone.number) {
            callback(ErrorMessage.MissingPhoneNumber, 400, undefined);
            return;
        } else {
            if (!Validator.IsPhoneNumber(SalonProfileData.information.phone.number)) {
                callback(ErrorMessage.WrongPhoneNumberFormat, 400, undefined);
                return;
            }
        }

        if (SalonProfileData.information.email && !Validator.IsEmail(SalonProfileData.information.email)) {
            callback(ErrorMessage.WrongEmailFormat, 400, undefined);
            return;
        }

        //create salon object in database
        SalonModel.create(SalonProfileData, (err: any, salon: SalonProfile) => {
            if (err) {
                callback(ErrorMessage.ServerError, 500, undefined);
            } else {
                this.SalonId = salon._id;
                var user = new User(this.SalonId, this.UserId);
                user.createProfile({
                    "salon_id": this.SalonId,
                    "role": User.SALON_OWNER_ROLE,
                    "status": true
                }, function (err, code, data) {
                    if (err) {
                        callback(err, code, undefined);
                    } else {
                        callback(undefined, 200, salon);
                    }
                });
            }
        });
    }

    /**
     * 
     */
    static isExisting(salon_id: string, callback) {
        SalonModel.findOne({ "_id": salon_id }, function (err, docs) {            
            if (err) {
                callback(ErrorMessage.ServerError, 500, undefined);
            } else if (!docs) {
                callback(undefined, 200, false);
            } else {
                callback(undefined, 200, true);
            }
        });
    }
}
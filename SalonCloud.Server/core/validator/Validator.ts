
/**
 * Validator
 */

import * as mongoose from "mongoose";
export class Validator {
    static IsEmail(email: string) {
        var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var isEmail = true;
        if (!email.match(emailReg)) {
            isEmail = false;
        }
        return isEmail;
    }

    static IsPhoneNumber(phonenumber: string) {
        var phoneReg = /^\d{10}$/;
        var isPhoneNumber = true;
        if (!phonenumber.match(phoneReg)) {
            isPhoneNumber = false;
        }
        return isPhoneNumber;
    }

    static IsSocialSecurityNumber(SocialSecurityNumber: string) {
        var SSNReg = /^\d{9}$/;
        var isSSN = true;
        if (!SocialSecurityNumber.match(SSNReg)) {
            isSSN = false;
        }
        return isSSN;
    }

    static IsSalaryRate(SalaryRate: number) {
        if (SalaryRate <= 0 || SalaryRate >= 10) {
            return false;
        } else {
            return true;
        }
    }

    static IsCashRate(CashRate: number) {
        if (CashRate <= 0 || CashRate >= 10) {
            return false;
        } else {
            return true;
        }
    }

    static IsAdress(address: string) {
        //TODO:

        return true;
    }

    static IsValidDate(date: Date) {
        return true;
    }

    static IsValidEndDateForStartDate(startDate: Date, endDate: Date) {
        if(endDate < startDate){
            return false;
        }else{
            return true;
        }
    }

    static IsValidCloseTimeForOpenTime(openTime: Number, closeTime: Number ){
        if(openTime >= closeTime){
            return false;
        }else{
            return true;
        }
    }

    static IsValidWeekDay(date: number) {
        if(date >= 0 && date <= 6){
            return true;
        }else{
            return false;
        }
    }

    static IsIdentifyString(Id: string) {
        return mongoose.Types.ObjectId.isValid(Id);
    }
}
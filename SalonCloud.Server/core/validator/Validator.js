/**
 * Validator
 */
"use strict";
const mongoose = require("mongoose");
class Validator {
    static IsEmail(email) {
        var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var isEmail = true;
        if (!email.match(emailReg)) {
            isEmail = false;
        }
        return isEmail;
    }
    static IsPhoneNumber(phonenumber) {
        var phoneReg = /^\d{10}$/;
        var isPhoneNumber = true;
        if (!phonenumber.match(phoneReg)) {
            isPhoneNumber = false;
        }
        return isPhoneNumber;
    }
    static IsSocialSecurityNumber(SocialSecurityNumber) {
        var SSNReg = /^\d{9}$/;
        var isSSN = true;
        if (!SocialSecurityNumber.match(SSNReg)) {
            isSSN = false;
        }
        return isSSN;
    }
    static IsSalaryRate(SalaryRate) {
        if (SalaryRate <= 0 || SalaryRate >= 10) {
            return false;
        }
        else {
            return true;
        }
    }
    static IsCashRate(CashRate) {
        if (CashRate <= 0 || CashRate >= 10) {
            return false;
        }
        else {
            return true;
        }
    }
    static IsAdress(address) {
        //TODO:
        return true;
    }
    static IsValidDate(date) {
        return true;
    }
    static IsValidEndDateForStartDate(startDate, endDate) {
        if (endDate < startDate) {
            return false;
        }
        else {
            return true;
        }
    }
    static IsValidCloseTimeForOpenTime(openTime, closeTime) {
        if (openTime >= closeTime) {
            return false;
        }
        else {
            return true;
        }
    }
    static IsValidWeekDay(date) {
        if (date >= 0 && date <= 6) {
            return true;
        }
        else {
            return false;
        }
    }
    static IsIdentifyString(Id) {
        return mongoose.Types.ObjectId.isValid(Id);
    }
}
exports.Validator = Validator;
//# sourceMappingURL=Validator.js.map
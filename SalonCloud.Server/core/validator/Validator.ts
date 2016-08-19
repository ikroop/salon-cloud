
/**
 * Validator
 */
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

    static IsAdress(address: string){
        return true;
    }
}
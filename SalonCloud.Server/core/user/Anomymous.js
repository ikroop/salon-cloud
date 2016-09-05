"use strict";
class Anomymous {
    constructor(Authentication) {
        this.Authentication = Authentication;
    }
    signUp(Username, Password, callback) {
        this.Authentication.signUpWithEmailAndPassword(Username, Password, callback);
    }
    signIn(Username, Password, callback) {
        this.Authentication.signInWithEmailAndPassword(Username, Password, callback);
    }
    forgotPassword(Username, callback) {
    }
}
exports.Anomymous = Anomymous;
//# sourceMappingURL=Anomymous.js.map
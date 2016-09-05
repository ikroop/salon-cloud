/**
 * 
 * 
 * 
 * 
 */
import {AnonymousBehavior} from "./AnonymousBehavior";
import {AuthenticationBehavior} from "./AuthenticationBehavior";

export class Anomymous implements AnonymousBehavior {
    private Authentication: AuthenticationBehavior;
    constructor(Authentication: AuthenticationBehavior) {
        this.Authentication = Authentication;
    }
    signUp(Username: string, Password: string, callback) {
        this.Authentication.signUpWithEmailAndPassword(Username, Password, callback);
    }
    signIn(Username: string, Password: string, callback) {
        this.Authentication.signInWithEmailAndPassword(Username, Password, callback);
    }
    forgotPassword(Username: string, callback) {
        
    }
}
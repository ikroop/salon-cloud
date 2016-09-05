/**
 * 
 * 
 * 
 */

export interface AnonymousBehavior {
    signUp(Username: string, Password: string, callback);
    signIn(Username: string, Password: string, callback);
    forgotPassword(Username: string, callback);
}
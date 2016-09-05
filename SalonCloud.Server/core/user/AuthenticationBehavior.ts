/**
 * 
 * 
 * 
 * 
 */

export interface AuthenticationBehavior{
    signUpWithEmailAndPassword(username: string, password: string, callback);
    signInWithEmailAndPassword(username: string, password: string, callback);
    verifyToken(token:string, callback); 
}
/**
 * 
 * 
 * 
 */
import { SalonCloudResponse } from "./../SalonCloudResponse";
export interface AuthorizationBehavior {
    checkPermission(userId: string, functionName: string): SalonCloudResponse<boolean>;
    //addPermission(apiFunction: string, id:string, status: boolean): SalonCloudResponse<boolean>;
    //removePermission(apiFunction: string, id:string): SalonCloudResponse<boolean>;
}
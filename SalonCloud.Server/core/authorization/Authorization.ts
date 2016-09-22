/**
 * 
 * 
 * 
 * 
 */
import { AuthorizationBehavior } from "./AuthorizationBehavior";
import { SalonCloudResponse } from "./../SalonCloudResponse";
export class Authorization implements AuthorizationBehavior{
    public checkPermission(userId: string, functionName: string): SalonCloudResponse<boolean> {
        var response: SalonCloudResponse<boolean>;
        response.code = 200;
        response.err = undefined;
        response.data = true;
        return response;
    }

    //public addPermission(apiFunction: string, id:string, status: boolean): SalonCloudResponse<boolean>;
    //public removePermission(apiFunction: string, id:string): SalonCloudResponse<boolean>;
}
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

    public AllowPemission(apiUrl : string, userType : number) : SalonCloudResponse<boolean>{
        return;
    };

    public DisAllowPermission(apiUrl : string, UserType) : SalonCloudResponse<boolean>{
        return;
    };

    private isExistPermission(apiUrl : string, status : boolean) : boolean {
        return;
    };

}



export interface AnonymousBehavior {
   
    auth: Authorization;

    salonPublicDP: SalonPublic;

    forgotPassword(username) : SalonCloudResponse<boolean>;

    signInWithUserAndPassword(user : string, password : string) : SalonCloudResponse<boolean>;

    signUpWithUserAndPassword(username : string, password : string) : SalonCloudResponse<boolean>;
}
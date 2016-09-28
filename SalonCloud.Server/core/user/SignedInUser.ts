

import {SignedInUserBehavior} from './SignedInUserBehavior'

export class SignedInUser implements SignedInUserBehavior{

    salonManagementDP: SalonManagement;

    public createSalon(salonInformation : SalonInformation) : SalonCloudResponse<SalonInformation> {

};

    public getSalonList() : SalonCloudResponse<Array<SalonInformation>> {

};

    public selectSalon(SalonId : string) : SalonCloudResponse<boolean> {

};


}


import {SignedInUserBehavior} from './SignedInUserBehavior'
import {SalonCloudResponse} from './../SalonCloudResponse'
import {SalonManagement} from './../../modules/salonManagement/SalonManagement'
import {SalonInformation} from './../../modules/salonManagement/SalonData'


export class SignedInUser implements SignedInUserBehavior{

    salonManagementDP: SalonManagement;

    public createSalon(salonInformation : SalonInformation) : SalonCloudResponse<SalonInformation> {

        return;
};

    public getSalonList() : SalonCloudResponse<Array<SalonInformation>> {

        return;
};

    public selectSalon(SalonId : string) : SalonCloudResponse<boolean> {
        return;
};


}

import {SalonCloudResponse} from './../SalonCloudResponse'
import {SalonManagement} from './../../modules/salonManagement/SalonManagement'
import {SalonInformation} from './../../modules/salonManagement/SalonData'

export interface SignedInUserBehavior {

    salonManagementDP: SalonManagement;

    createSalon(salonInformation : SalonInformation) : SalonCloudResponse<SalonInformation>;

    getSalonList() : SalonCloudResponse<Array<SalonInformation>>;

    selectSalon(SalonId : string) : SalonCloudResponse<boolean>;

}


/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import {SalonCloudResponse} from './../SalonCloudResponse'
import {SalonManagement} from './../../Modules/SalonManagement/SalonManagement'
import {SalonInformation} from './../../Modules/SalonManagement/SalonData'

export interface SignedInUserBehavior {

    salonManagementDP: SalonManagement;

    createSalon(salonInformation : SalonInformation);

    getSalonList() : Promise<SalonCloudResponse<Array<SalonInformation>>>;

    selectSalon(SalonId : string) : SalonCloudResponse<boolean>;

}


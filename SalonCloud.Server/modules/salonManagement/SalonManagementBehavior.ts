

import {SalonData} from './SalonData'
import {SalonCloudResponse} from './../../core/SalonCloudResponse'


export interface SalonManagementBehavior {

    activate() : SalonCloudResponse<boolean>;

    createInformation(salonId : string, data : SalonInformation) : SalonCloudResponse<string>;

    createSalon(salonInformation) : SalonCloudResponse<string>;

    createSetting(salonId : string, setting : SalonSetting) : SalonCloudResponse<boolean>;

    deactivate() : SalonCloudResponse<boolean>;

    getAllSalon(userId : string) : SalonCloudResponse<SalonInformation>;

    updateInformation(data : SalonInformation) : SalonCloudResponse<boolean>;

    updateSetting(setting : SalonSetting) : SalonCloudResponse<boolean>;

    
}
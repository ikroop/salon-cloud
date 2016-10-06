



import {SalonManagementBehavior} from './SalonManagementBehavior'
import {SalonData, SalonInformation, SalonSetting} from './SalonData'
import {SalonCloudResponse} from './../../core/SalonCloudResponse'

export class SalonManagement implements SalonManagementBehavior {

    salonId: string;

    public activate() : SalonCloudResponse<boolean>{
        return;
    };

    public createInformation(salonId : string, data : SalonInformation) : SalonCloudResponse<string>{
        return;
    };

    public createSalon(salonInformation) : SalonCloudResponse<string>{
        return;
    };

    public createSetting(salonId : string, setting : SalonSetting) : SalonCloudResponse<boolean>{
        return;
    };

    public deactivate() : SalonCloudResponse<boolean>{
        return;
    };

    public getAllSalon(userId : string) : SalonCloudResponse<SalonInformation>{
        return;
    };

    public updateInformation(data : SalonInformation) : SalonCloudResponse<boolean>{
        return;
    };

    public updateSetting(setting : SalonSetting) : SalonCloudResponse<boolean>{
        return;
    };

    
}




import {SalonManagementBehavior} from './SalonManagementBehavior'

export class SalonManagement implements SalonManagementBehavior {

    salonId: string;

    public activate() : SalonCloudResponse<boolean>{

    };

    public createInformation(salonId : string, data : SalonInformation) : SalonCloudResponse<string>{

    };

    public createSalon(salonInformation) : SalonCloudResponse<string>{

    };

    public createSetting(salonId : string, setting : SalonSetting) : SalonCloudResponse<boolean>{

    };

    public deactivate() : SalonCloudResponse<boolean>{

    };

    public getAllSalon(userId : string) : SalonCloudResponse<SalonInformation>{

    };

    public updateInformation(data : SalonInformation) : SalonCloudRespoonse<boolean>{

    };

    public updateSetting(setting : SalonSetting) : SalonCloudResponse<boolean>{
        
    };

    
}
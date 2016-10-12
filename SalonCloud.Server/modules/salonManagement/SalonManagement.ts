



import {SalonManagementBehavior} from './SalonManagementBehavior'
import {SalonData, SalonInformation, SalonSetting} from './SalonData'
import {SalonCloudResponse} from './../../core/SalonCloudResponse'
import {SalonModel, SalonProfileSchema} from './SalonModel'
import {defaultSalonSetting} from './../../core/defaultData'


export class SalonManagement implements SalonManagementBehavior {

    salonId: string;

    public activate() : SalonCloudResponse<boolean>{
        return;
    };

    public createInformation(salonId : string, data : SalonInformation) : SalonCloudResponse<string>{
        return;
    };

    public async createSalonDocs(salonInformation : SalonInformation){
        //step 1: 
        var returnResult : SalonCloudResponse<SalonData> = {
            code: undefined,
            data: undefined,
            err: undefined
        };
        var salonData: SalonData = {
            information: salonInformation,
            setting: defaultSalonSetting,
        }

        var SalonCreation = SalonModel.create(salonData);
        await SalonCreation.then(function(docs){
                returnResult.data = docs;
            }, function(err){
                returnResult.err = err;
            })

        return returnResult;
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
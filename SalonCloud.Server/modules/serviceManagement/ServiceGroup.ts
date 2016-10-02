


import {ServiceItem} from './ServiceItem'
import {SalonCloudResponse} from './../../core/SalonCloudResponse'


export class ServiceGroup {

    description: string;
    id: string;
    name; string;
    ServiceArray: Array<ServiceItem>;

    public addService(service : ServiceItem) : SalonCloudResponse<boolean>{
        return;
    };

    public getDescription() : string {
        return;
    };

    public getName() : string {
        return;
    };

    public getService(index : number) : ServiceItem{
        return;
    };

    public removeService(index : number) : boolean {
        return;
    };
}
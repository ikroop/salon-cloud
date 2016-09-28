


import {ServiceItem} from './ServiceItem'

export class ServiceGroup {

    description: string;
    id: string;
    name; string;
    ServiceArray: Array<ServiceItem>;

    public addService(service : ServiceItem) : SalonCloudResponse<boolean>{

    };

    public getDescription() : string {

    };

    public getName() : string {

    };

    public getService(index : number) : ServiceItem{

    };

    public removeService(index : number) : boolean {

    };
}
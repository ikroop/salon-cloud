/**
 * 
 * 
 */


import {ServiceItem} from './ServiceItem'
import {SalonCloudResponse} from './../../core/SalonCloudResponse'


export class ServiceGroup {

    private description: string;
    private id: string;
    private name: string;
    private ServiceArray: Array<ServiceItem>;

    public addService(service : ServiceItem) : SalonCloudResponse<boolean>{
        return;
    };


	public get $description(): string {
		return this.description;
	}

	public set $description(value: string) {
		this.description = value;
	}

	public get $id(): string {
		return this.id;
	}

	public set $id(value: string) {
		this.id = value;
	}

	public get $name(): string {
		return this.name;
	}

	public set $name(value: string) {
		this.name = value;
	}        

    public getService(index : number) : ServiceItem{
        return;
    };

    public removeService(index : number) : boolean {
        return;
    };
}
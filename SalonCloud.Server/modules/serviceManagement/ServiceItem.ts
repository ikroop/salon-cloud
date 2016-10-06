/**
 * SalonHelps Copyright.
 * 
 */

export class ServiceItem {
    private id: string;
    private name: string;
    private price: number;
    private time: number;

    constructor($id: string, $name: string, $price: number, $time: number) {
        this.id = $id;
        this.name = $name;
        this.price = $price;
        this.time = $time;
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

    public get $time(): number {
        return this.time;
    }

    public set $time(value: number) {
        this.time = value;
    }

    public get $price(): number {
        return this.price;
    }

    public set $price(value: number) {
        this.price = value;
    }

}
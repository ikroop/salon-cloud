

export class Timezone {
    salonTimezone: string;

    public constructor(salonTimezone : string){

    };

    public convertToClientTimezone(date : Date, clientTimeZone : string) : Date{

    };

    public convertToSalonTimezone(date : Date, clientTimezone : string) : Date{

    };

    public getTimezoneFromAddress(address : string) : string{

    };

    private convertTimezone(date : Date, timezoneSource : string, timezoneDestination : string) : Date{

    };
}
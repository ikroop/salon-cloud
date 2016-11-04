

export class Timezone {
    salonTimezone: string;

    public constructor(salonTimezone: string) {

    };

    public convertToClientTimezone(date: Date, clientTimeZone: string): Date {
        return;
    };

    public convertToSalonTimezone(date: Date, clientTimezone: string): Date {
        return;
    };

    public getTimezoneFromAddress(address: string): string {
        return;
    };

    private convertTimezone(date: Date, timezoneSource: string, timezoneDestination: string): Date {
        return;
    };
}
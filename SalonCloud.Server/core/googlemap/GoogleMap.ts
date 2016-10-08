/**
 * 
 * 
 * 
 * 
 */
var googleMapsClient = require('@google/maps').createClient();

export class GoogleMap {
    static async getTimeZone(address: string) {
        var geocode: any = undefined;
        var timezone: any = undefined;
        await googleMapsClient.geocode({
            address: address
        }, function (err, response) {
            if (!err) {
                console.log(response.json.results);
            }
        });

        await googleMapsClient.timezone({
            location: [geocode.lat, geocode.long],
            timestamp: 1331766000,
            language: 'en'
        }, function (err, response) {
            timezone = response.json;
        });

        return timezone;
    }
}
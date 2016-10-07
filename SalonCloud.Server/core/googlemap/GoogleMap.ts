var googleMapsClient = require('@google/maps').createClient();

export class GoogleMap {
    static async getTimeZone(address: string) {
        var geocode: any = undefined;
        await googleMapsClient.geocode({
            address: address
        }, function (err, response) {
            if (!err) {
                console.log(response.json.results);
            }
        });
    }
}
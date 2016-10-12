/**
 * 
 * 
 * 
 * 
 */
var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCptaA0X0FDTsjVgotaKtGgbPYjXBszGgk'
});
export class GoogleMap {
    static async getTimeZone(address: string) {
        var geocode: any = undefined;
        var timezone: any = undefined;

        let promise = new Promise(function(resolve, reject) {
            googleMapsClient.geocode({
                address: address
            }, function(err, response) {
                if (!err) {
                    geocode = response.json.results[0].geometry.location;
                    timezone = googleMapsClient.timezone({
                        location: [geocode.lat, geocode.lng]
                    }, function(err, response) {
                        if (!err) {
                            timezone = response.json;
                            resolve(timezone);
                        } else {
                            resolve(err);
                        }
                    });
                } else {
                    resolve(err);
                }
            })
        });

        return promise;
    }
}
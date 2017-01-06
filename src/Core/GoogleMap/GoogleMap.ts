/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCptaA0X0FDTsjVgotaKtGgbPYjXBszGgk'
});
export class GoogleMap {

    /**
	*@name: getTimeZone
    *@parameter: address: string
    *@return: timezone object
	*/
    static async getTimeZone(address: string) {
        var geocode: any = null;
        var timezone: any = null;

        let promise = new Promise(function(resolve, reject) {
            googleMapsClient.geocode({ // get geocode
                address: address
            }, function(err, response) {
                if (!err) {
                    geocode = response.json.results[0].geometry.location;

                    googleMapsClient.timezone({ // get timezone
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
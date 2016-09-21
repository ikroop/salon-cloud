"use strict";
const BaseSubject_1 = require("./BaseSubject");
class WeatherSubject extends BaseSubject_1.BaseSubject {
    constructor() {
        super();
        this.temperature = 90;
    }
    getTemperature() {
        return this.temperature;
    }
    setTemperature(temperature) {
        this.temperature = temperature;
    }
}
exports.WeatherSubject = WeatherSubject;
class WeatherClient {
    constructor(weatherSubject) {
        this.weatherSubject = weatherSubject;
    }
    update() {
        console.log("notification when temperature changed: " + this.weatherSubject.getTemperature());
    }
}
exports.WeatherClient = WeatherClient;
//# sourceMappingURL=Sample.js.map
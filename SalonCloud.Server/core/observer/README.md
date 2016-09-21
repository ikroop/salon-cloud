Observer pattern library
==================================
**Description**

This library is the implement of Observer pattern. Chapter 2: Header first design pattern

**Usage**
- For example, a Weather Server object has many Weather Client objects. Each time the temperature value of weather subject changed, it will notify to all weather clients.
[core/observer/Sample.ts](https://github.com/thanhtruong0315/salon-cloud/blob/master/SalonCloud.Server/core/observer/Sample.ts):
```
import { BaseSubject } from "./BaseSubject";
import { Observer } from "./Observer";

class WeatherSubject extends BaseSubject {
  private temperature : number;

  constructor() {
    super();
    this.temperature = 90;
  }

  public getTemperature(): number {
    return this.temperature;
  }

  public setTemperature(temperature: number): void {
    this.temperature = temperature;
  }
}

class WeatherClient implements Observer {
  private weatherSubject : WeatherSubject;

  constructor(weatherSubject: WeatherSubject) {
    this.weatherSubject = weatherSubject;
  }

  public update(): void {
    console.log("notification when temperature changed: " + this.weatherSubject.getTemperature());
  }
}

export {
  WeatherSubject,
  WeatherClient
}

```
- There is the running code:
```
let weatherSubject = new WeatherSubject();

let weatherClient1 = new WeatherClient(weatherSubject);
let weatherClient2 = new WeatherClient(weatherSubject);

 weatherSubject.registerObserver(weatherClient1);
 weatherSubject.registerObserver(weatherClient2);

 weatherSubject.notifyObservers();

 weatherSubject.setTemperature(33);
 weatherSubject.notifyObservers();

 weatherSubject.removeObserver(weatherClient2);
 weatherSubject.setTemperature(11);
 weatherSubject.notifyObservers();
```
- The output value will be:
```
notification when temperature changed: 90
notification when temperature changed: 90
notification when temperature changed: 33
notification when temperature changed: 33
notification when temperature changed: 11
```

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

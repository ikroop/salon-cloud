

import { AppointmentItemData } from './../../../Modules/AppointmentManagement/AppointmentData'
import { Observable } from './../Observable'
import { Observer } from './../Observer'
import { SalonTime } from './../../salonTime/salonTime'

export class AppointmentCreationObservable implements Observable {
    appointment: AppointmentItemData;
    observerArray: [Observer];
    public registerObserver(observer: Observer) {
        this.observerArray.push(observer);
    }

    public removeObserver(observer: Observer) {
        const n: number = this.observerArray.indexOf(observer);
        this.observerArray.splice(n, 1);
    }

    public notifyObservers(inputData: any) {
        this.observerArray.forEach(osv => osv.update(inputData));
    }

}
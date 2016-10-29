import { Subject } from "./Subject";
import { Observer } from "./Observer";

export class BaseSubject implements Subject {
    private observers: Observer[] = [];

    public registerObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    public removeObserver(observer: Observer): void {
        const n: number = this.observers.indexOf(observer);
        this.observers.splice(n, 1);
    }

    public notifyObservers(): void {
        this.observers.forEach(osv => osv.update());
    }
}

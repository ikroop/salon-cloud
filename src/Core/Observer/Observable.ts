import { Observer } from './Observer';

export interface Observable {
    observerArray: [Observer];
    registerObserver(observer: Observer);
    removeObserver(observer: Observer);
    notifyObservers(inputData: any);

}
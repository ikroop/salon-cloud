"use strict";
class BaseSubject {
    constructor() {
        this.observers = [];
    }
    registerObserver(observer) {
        this.observers.push(observer);
    }
    removeObserver(observer) {
        const n = this.observers.indexOf(observer);
        this.observers.splice(n, 1);
    }
    notifyObservers() {
        this.observers.forEach(osv => osv.update());
    }
}
exports.BaseSubject = BaseSubject;
//# sourceMappingURL=BaseSubject.js.map
/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { Observer } from './Observer';

export interface Subject {
  registerObserver(observer: Observer): void;
  removeObserver(observer: Observer): void;
  notifyObservers(): void;
}

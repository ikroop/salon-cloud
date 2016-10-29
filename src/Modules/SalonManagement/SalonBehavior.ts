/**
 * 
 * 
 * 
 * 
 */

import {SalonData} from './SalonData';
export interface SalonBehavior{
    createSalonInformation(SalonProfileData: SalonData, callback);
    getId();
}
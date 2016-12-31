/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */
import { SalonCloudResponse } from './../../Core/SalonCloudResponse';
import { SalonData } from './SalonData'

export interface SalonManagementDatabaseInterface {
    createSalon(salon: SalonData): Promise<SalonData>;
    getSalonById(id: string): Promise<SalonData>;
}
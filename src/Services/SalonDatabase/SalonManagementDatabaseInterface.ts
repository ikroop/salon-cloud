/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */
import { SalonCloudResponse } from './../../Core/SalonCloudResponse';
import { SalonData, ISalonData } from './../../Modules/SalonManagement/SalonData';

export interface SalonManagementDatabaseInterface<T> {
    createSalon(salon: SalonData): Promise<T>;
    getSalonById(): Promise<T>;
    updateSalon(data: SalonData): Promise<ISalonData>;
}
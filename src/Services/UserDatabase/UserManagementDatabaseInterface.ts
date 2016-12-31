/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */
import { SalonCloudResponse } from './../../Core/SalonCloudResponse';
import { UserData, UserProfile } from './../../Modules/UserManagement/UserData'

export interface UserManagementDatabaseInterface<T> {
    getUserById(userId: string, salonId: string): Promise<T>;
    getUserByPhone(phone: string, salonId: string): Promise<T>;
    createProfile(userId: string, userProfile: UserProfile): Promise<SalonCloudResponse<UserProfile>>;
    getAllEmployees(salonId: string): Promise<T[]>;
}
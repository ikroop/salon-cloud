/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */
import { SalonCloudResponse } from './../../Core/SalonCloudResponse';
import { UserData, UserProfile } from './../../Modules/UserManagement/UserData'

export interface UserManagementDatabaseInterface<T> {
    getUserById(userId: string): Promise<T>;
    getUserByPhone(phone: string): Promise<T>;
    createProfile(userId: string, userProfile: UserProfile): Promise<SalonCloudResponse<UserProfile>>;
    getAllEmployees(): Promise<T[]>;
}
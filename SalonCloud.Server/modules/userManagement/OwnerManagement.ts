
import { UserManagement } from './UserManagement'
import { UserProfile } from './UserData'
import { SalonCloudResponse } from './../../core/SalonCloudResponse'

export class OwnerManagement extends UserManagement {

    /**
     * addOwnerProfile
     * create new user with username (phone or email) & password
     * @param : 
     *     userId: string
     * @returns 
     *     - Validation Error
     *     - Profile data
     */
    public async addOwnerProfile(userId: string): Promise<SalonCloudResponse<UserProfile>> {
        let response: SalonCloudResponse<UserProfile> = {
            code: undefined,
            data: undefined,
            err: undefined
        }
        var newProfile: UserProfile = {
            fullname: '',
            nickname: '',
            role: 1,
            salon_id: this.salonId,
            status: true,
        }
        var profileCreation = await this.addProfile(userId, newProfile);

        if (profileCreation.err) {
            response.err = profileCreation.err;
            response.code = profileCreation.code;
            return response;
        } else {
            response.data = profileCreation.data;
            response.code = profileCreation.code;
            return response;
        }
    }
}
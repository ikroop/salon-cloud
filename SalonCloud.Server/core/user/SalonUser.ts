

import {SignedInUser} from './SignedInUser'
import {UserProfileBehavior} from './UserProfileBehavior'

export class SalonUser extends SignedInUser implements UserProfileBehavior {

    SalonPublicDP : SalonPublic;

    activate():SalonCloudResponse<boolean>{

    };

    createProfile(Profile : UserProfile) : SalonCloudResponse<boolean>{

    };

    deactivate() : SalonCloudResponse<boolean> {

    };

    getProfile() : SalonCloudResponse<UserProfile> {

    };

    updateProfile(profile : UserProfile) : SalonCloudResponse<boolean> {

    };
}
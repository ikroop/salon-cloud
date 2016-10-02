

import {SignedInUser} from './SignedInUser'
import {UserProfileBehavior} from './UserProfileBehavior'
import {SalonCloudResponse} from './../SalonCloudResponse'
import {UserProfile} from './UserData'

export class SalonUser extends SignedInUser implements UserProfileBehavior {

    SalonPublicDP : SalonPublic;

    activate():SalonCloudResponse<boolean>{

        return;
    };

    createProfile(Profile : UserProfile) : SalonCloudResponse<boolean>{

        return;
    };

    deactivate() : SalonCloudResponse<boolean> {

        return;
    };

    getProfile() : SalonCloudResponse<UserProfile> {

        return;
    };

    updateProfile(profile : UserProfile) : SalonCloudResponse<boolean> {

        return;
    };
}
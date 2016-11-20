/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

export const RoleConfig =
    [
        {
            'api': '/api/v1/Authentication/signupwithusernameandpassword',
            'role': [
                'Anonymouse'
            ]
        },
        {
            'api': '/api/v1/Authentication/signinwithusernameandpassword',
            'role': [
                'Anonymouse'
            ]
        },
        {
            'api': '/api/v1/salon/create',
            'role': [
                'SignedUser'
            ]
        },
        {
            'api': '/api/v1/employee/create',
            'role': [
                'Owner'
            ]
        },
        {
            'api': '/api/v1/service/create',
            'role': [
                'Owner'
            ]
        }
    ]
    ;
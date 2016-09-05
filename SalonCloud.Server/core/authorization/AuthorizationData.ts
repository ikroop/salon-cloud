/**
 * 
 * 
 * 
 */

export interface TokenData {
    expire: Date,
    token: string,
    iat: Date
}

export interface AuthorizationData {
    auth: TokenData,
    is_verified: boolean,
    status: boolean,
    username: string,
    _id: string
} 
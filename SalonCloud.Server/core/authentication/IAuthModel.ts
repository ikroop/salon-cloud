import {IUserModel} from './../../modules/user/IUserModel';

export interface IAuthModel extends IUserModel {
    Token?: string;
    EmailVerified?: string;
    TokenExpire?: number;
}
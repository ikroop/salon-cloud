import {IUserModel} from './../User/IUserModel';

export interface IAuthModel extends IUserModel {
    Token?: string;
    EmailVerified?: string;
    TokenExpire?: number;
}
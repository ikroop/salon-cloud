//
//
//
//
//
//
import * as mongoose from "mongoose";

export interface ISalon{
    salon_name: string;
    address: string;
    phonenumber: string;
    email?: string;
}
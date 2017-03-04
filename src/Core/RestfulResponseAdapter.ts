/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import { SalonCloudResponse } from './SalonCloudResponse';

export interface RestfulResponseData {

    version?: string;
    error?: {
        code: number,
        name: string,
        message: string
    };
    data?: any
}

export class RestfulResponseAdapter {
    private salonResponse: SalonCloudResponse<any>;
    private readonly VERSION: string = "1.0.0";

    constructor(response: SalonCloudResponse<any>) {
        this.salonResponse = response;
    }

    public googleRestfulResponse(): RestfulResponseData {
        let restfulResponse: RestfulResponseData = {
            version: undefined,
            error: {
                code: undefined,
                name: undefined,
                message: undefined
            },
            data: undefined
        }

        restfulResponse.version = this.VERSION;
        if (this.salonResponse.code !== 200) {
            restfulResponse.error.code = this.salonResponse.code;
            restfulResponse.error.message = this.salonResponse.err.err.message;
            restfulResponse.error.name = this.salonResponse.err.err.name;
        } else {
            restfulResponse.data = this.salonResponse.data;
            restfulResponse.error = undefined;
        }

        return restfulResponse;
    }
}
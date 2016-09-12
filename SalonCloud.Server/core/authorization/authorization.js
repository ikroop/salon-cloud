"use strict";
class Authentication {
    checkPermission(userId, functionName) {
        var response;
        response.code = 200;
        response.err = undefined;
        response.data = true;
        return response;
    }
}
exports.Authentication = Authentication;
//# sourceMappingURL=authorization.js.map
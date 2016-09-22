"use strict";
class Authorization {
    checkPermission(userId, functionName) {
        var response;
        response.code = 200;
        response.err = undefined;
        response.data = true;
        return response;
    }
}
exports.Authorization = Authorization;
//# sourceMappingURL=authorization.js.map
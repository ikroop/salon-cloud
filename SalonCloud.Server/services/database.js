"use strict";
/**
 *
 *
 */
const mongoose = require("mongoose");
exports.mongoose = mongoose;
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://saloncloud:siamtian2015@ds145365.mlab.com:45365/salon-cloud");
//# sourceMappingURL=database.js.map
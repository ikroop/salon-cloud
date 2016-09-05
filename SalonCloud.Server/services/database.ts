/**
 * 
 * 
 */
import * as mongoose from "mongoose";
import mockgoose = require("mockgoose");

mongoose.Promise = global.Promise;

if (process.env.NODE_ENV === "testing") {
    mockgoose(mongoose).then((): void => { mongoose.connect("mongodb://saloncloud:siamtian2015@ds145365.mlab.com:45365/salon-cloud") });
} else {
    mongoose.connect("mongodb://saloncloud:siamtian2015@ds145365.mlab.com:45365/salon-cloud");
}

export { mongoose };
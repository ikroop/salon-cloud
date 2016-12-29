/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

import mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://saloncloud:siamtian2015@ds145365.mlab.com:45365/salon-cloud');

export { mongoose };
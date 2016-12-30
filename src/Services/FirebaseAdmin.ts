/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

var firebaseAdmin = require('firebase-admin');
var path = process.cwd();

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert('./Config/Dev/salon-cloud-dev-81007-firebase-adminsdk-0lbta-29b3ebe135.json'),
  databaseURL: 'https://salon-cloud-dev-81007.firebaseio.com'
});

export { firebaseAdmin };
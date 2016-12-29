/**
 * @license
 * Copyright SalonHelps. All Rights Reserved.
 *
 */

var firebase = require('firebase');

var config = {
    apiKey: "AIzaSyDIFUmzMAVMiVhRmxVSrXrG4oOuNk92WMg",
    authDomain: "salon-cloud-dev-81007.firebaseapp.com",
    databaseURL: "https://salon-cloud-dev-81007.firebaseio.com",
    storageBucket: "salon-cloud-dev-81007.appspot.com",
    messagingSenderId: "1072742575595"
  };
var firebase = firebase.initializeApp(config);

export { firebase };
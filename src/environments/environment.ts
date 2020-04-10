// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase : {
    apiKey: "AIzaSyDKamvNpfySihbG4TmyvIeSrtpSK5wr96Q",
    authDomain: "awesome-listbackend.firebaseapp.com",
    databaseURL: "https://awesome-listbackend.firebaseio.com",
    projectId: "awesome-listbackend",
    storageBucket: "awesome-listbackend.appspot.com",
    messagingSenderId: "25227693402",
    appId: "1:25227693402:web:04de142eebf8bb82c27763",
    measurementId: "G-5E29W2D1J9",
    auth: {
      baseURL:'https://www.googleapis.com/identitytoolkit/v3/relyingparty'
  },
  firestore: {
  baseURL : 
  'https://firestore.googleapis.com/v1/projects/awesome-listbackend/databases/(default)/documents'
}
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
const web = 'http://localhost:4200';

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyAgQJTAqrjG5Oh0NfO6PzRMXmC-e6zMykI",
    authDomain: "aser-corredores.firebaseapp.com",
    databaseURL: "https://aser-corredores.firebaseio.com",
    projectId: "aser-corredores",
    storageBucket: "aser-corredores.appspot.com",
    messagingSenderId: "621180960957",
    appId: "1:621180960957:web:91d656d7faf9ecd61877d4",
    measurementId: "G-6RVWNET9PJ"
  },
  versionCheckURL : web+'/version.json',//'https://chacaitobaires-dev.web.app/version.json',
  web: web,
  updateMinutes: 5,
  apiUrl: 'http://localhost:5000/aser-corredores/us-central1/api',
};

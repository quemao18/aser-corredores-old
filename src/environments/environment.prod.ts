
const web = 'http://localhost:4200';

export const environment = {
  production: true,
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

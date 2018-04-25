import * as firebase from 'firebase'
import 'firebase/firestore'

const firebaseConfig = {
	apiKey: "AIzaSyC6X2ZMepBvsrDSuF6Fe8_evU7ns1OfRoo",
	authDomain: "pridepocket-3473b.firebaseapp.com",
	databaseURL: "https://pridepocket-3473b.firebaseio.com",
	projectId: "pridepocket-3473b",
	storageBucket: "pridepocket-3473b.appspot.com",
	messagingSenderId: "760914673438"
}

firebase.initializeApp(firebaseConfig)

/*
With this change, timestamps stored in Cloud Firestore will be read back as
Firebase Timestamp objects instead of as system Date objects. So you will also
need to update code expecting a Date to instead expect a Timestamp. For example:

  // Old:
  const date = snapshot.get('created_at');
  // New:
  const timestamp = snapshot.get('created_at');
  const date = timestamp.toDate();
*/


export const db = firebase.firestore()
const settings = { timestampsInSnapshots: true};
db.settings(settings);


export { firebase }
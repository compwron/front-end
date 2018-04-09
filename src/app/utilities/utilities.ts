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

export const db = firebase.firestore()

export { firebase }
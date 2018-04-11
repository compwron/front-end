import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

// import { fromEvent } from 'rxjs/observable/fromEvent'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'

import { User } from '../objects/User'

import { firebase, db } from '../utilities/utilities'

@Injectable()
export class LoginService {
	constructor(
		private router: Router
	) { }

	authKey: string
	user: string
	previous: string = "/"
	pridepocketUser: User
	
	extractUser = map(response => response.user)
	
	loggedIn (): bool { return !!firebase.auth().currentUser }

	setPrevious (previous): void { this.previous = previous }

	handleCallback (observable): void {
		// inject a spinner service on the constructor and trigger it here
		
		console.log("in handleCallback")
		
		observable.subscribe(user => {
			this.user = user
			
			console.log("login successful", this.loggedIn())

			console.log("firebase user's uid: ", user.uid)
			// get the user's profile from the firestore and save it in pridepocketUser
			db.collection("users").doc(user.uid).get()
				.then(response => {
					if (response.exists) {
						this.pridepocketUser = response.data()
						console.log("got an existing user from the database")
					}
					else {
						let { uid, displayName, phoneNumber, email } = user
						db.collection("users").doc(uid).set({ uid, displayName, phoneNumber, email })
							.then(() => {
								this.pridepocketUser = { uid, displayName, phoneNumber, email }
								console.log("created a new user", this.pridepocketUser)
							})
							.catch(e => console.log("error while creating a new user in the database", e))
					}
				})
				.catch(e => console.log("error while fetching a user from the database", e))

			// kill the spinner
			
			// route to the page the user started at?
			this.router.navigateByUrl(this.previous)
		}
	}

	facebook (): void {
		const provider = new firebase.auth.FacebookAuthProvider()
		const o = fromPrommise(firebase.auth().signInWithPopup(provider))
		
		this.handleCallback(this.extractUser(o))

	}
	
	google (): void {
		const provider = new firebase.auth.GoogleAuthProvider()
		const o = fromPromise(firebase.auth().signInWithPopup(provider))
		
		this.handleCallback(this.extractUser(o))
	}
	
	email (email, password): void {
		firebase.auth().signInWithEmailAndPassword(email, password)
		const o = firebase.auth().onAuthStateChanged
		this.handleCallback(o)
	}
	
	emailSignup (email, password): void {
		firebase.auth().createUserWithEmailAndPassword(email, password)
		const o = firebase.auth().onAuthStateChanged
		this.handleCallback(o)
	}
	
	signOut (): void {
		firebase.auth().signOut().then(function() {
			console.log("successful signout")
		}).catch(function(error) {
			console.log("an error occurred while signing out", error)
		});
	}
}

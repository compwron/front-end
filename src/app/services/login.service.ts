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
	) {
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				this.currentUser = user
				this.router.navigateByUrl(this.previous)
			}
		})
	}

	static pridepocketUser //: User

	authKey: string
	// user //: User
	displayName: string
	previous: string = "/"
	currentUser
	
	extractUser = map((response: firebase.auth.UserCredential) => response.user)
	
	getUser () { return firebase.auth().currentUser}
	loggedIn (): boolean { return !!firebase.auth().currentUser }

	setPrevious (previous): void { this.previous = previous }

	getCurrentUserId (): string { return firebase.auth().currentUser.uid }

	handleCallback (observable: Observable<any>): void {
		// inject a spinner service on the constructor and trigger it here
		
		observable.subscribe(user => {
			// this.user = user
			// get the user's profile from the firestore and save it in pridepocketUser
			db.collection("users").doc(user.uid).get()
				.then(response => {
					if (response.exists) {
						this.pridepocketUser = response.data()
						console.log("got an existing user from the database")
					}
					else {
						let { uid, displayName, phoneNumber, email } = user
						if (this.displayName) displayName = this.displayName
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
		})
	}

	// handleEmailSignin (onAuthStateChanged) {
	handleEmailSignin () {
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				// this.user = user
				// get the user's profile from the firestore and save it in pridepocketUser
				db.collection("users").doc(user.uid).get()
					.then(response => {
						
						// if the user exists in the database, then populate this.pridepocketUser with the DB representation
						if (response.exists) {
							this.pridepocketUser = response.data()
							console.log("got an existing user from the database")
						}
						
						// if the user does not exist in the database, then create a new user with the authentication data returned from firebase
						else {
							let { uid, displayName, phoneNumber, email } = user
							
							// set the displayName variable if it exists; this is used for displaying the user's name in the navigation bar
							//  this is redundant and probably going away
							if (this.displayName) displayName = this.displayName
							db.collection("users").doc(uid).set({ uid, displayName, phoneNumber, email })
								.then(() => {
									
									// if the database set returns, then populate this.pridepocketUser with the firebase auth info
									this.pridepocketUser = { uid, displayName, phoneNumber, email }
									// this.user = { uid, displayName, phoneNumber, email }
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
		})
	}

	facebook (): void {
		const provider = new firebase.auth.FacebookAuthProvider()
		const o = fromPromise(firebase.auth().signInWithPopup(provider))
		
		this.handleCallback(this.extractUser(o))

	}
	
	google (): void {
		const provider = new firebase.auth.GoogleAuthProvider()
		const o = fromPromise(firebase.auth().signInWithPopup(provider))
		
		this.handleCallback(this.extractUser(o))
	}
	
	email (email, password): void {
		firebase.auth().signInWithEmailAndPassword(email, password)
		// const o = firebase.auth().onAuthStateChanged
		this.handleEmailSignin()
	}
	
	emailSignup (email, password, displayName): void {
		this.displayName = displayName
		firebase.auth().createUserWithEmailAndPassword(email, password)
		// const o = firebase.auth().onAuthStateChanged
		this.handleEmailSignin()
	}
	
	signOut (): void {
		firebase.auth().signOut().then(function() {
			console.log("successful signout")
		}).catch(function(error) {
			console.log("an error occurred while signing out", error)
		});
	}
}

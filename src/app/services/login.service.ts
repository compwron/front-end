import { Injectable } from '@angular/core'
import { Router } from '@angular/router'

import { fromPromise } from 'rxjs/observable/fromPromise'
import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'
// import { pipe } from 'rxjs/util/pipe'


import { User } from '../objects/UserInterfaces' // , UserUpdateObject
// import { User } from '../objects/User'

import { firebase, db } from '../utilities/utilities'

@Injectable()
export class LoginService {
	constructor(
		private router: Router
	) { this.processFirebaseAuth() }

	pridepocketUser: User
	pendingUser: Observable<firebase.firestore.DocumentSnapshot>
	loading: boolean = true
	authKey: string
	displayName: string
	previous: string = "/"
	initializer: Observable<any>

	extractUser = map((response: firebase.auth.UserCredential) => <firebase.User>response.user)

	wait (): Observable<boolean> {
		return new Observable(observer => {
			this.initializer
				.subscribe(
					(user: firebase.User) => user ? observer.next(true) : observer.next(false),
					e => observer.error(e),
					() => observer.complete()
				)
		})

	}

	initialize () { return new Observable(observer => firebase.auth().onAuthStateChanged(observer)) }

	processFirebaseAuth () {
		this.initializer = this.initialize()

		this.initializer
			.subscribe(
				(user: firebase.User) => {
					if (!user) { this.router.navigateByUrl('/login') }
					else {
						this.getUser(user.uid).subscribe(
							r => {
								this.pridepocketUser = <User>r.data()
								this.loading = false
								console.log("setting pridepocketUser")
							},
							e => console.log("error getting pridepocketUser from firestore DB: ", e),
						)
					}
				},
				e => console.log("error initializing auth", e),
				() => console.log("auth successfully initialized")
			)
	}
							// () => console.log("completed getting user from firestore DB")
	

	getUser (uid): Observable<firebase.firestore.DocumentSnapshot> {
		this.pendingUser = fromPromise(db.collection("users").doc(uid).get())
		return this.pendingUser
	}

	loggedIn (): boolean { return !!firebase.auth().currentUser }

	setPrevious (previous): void { this.previous = previous }

	handleCallback (observable: Observable<firebase.User>): void {
		// inject a spinner service on the constructor and trigger it here
		
		observable.subscribe(
			user => {
				// const user = userCredential.user
				// get the user's profile from firestore and save it in pridepocketUser
				db.collection("users").doc(user.uid).get()
					.then(response => {
						if (response.exists) {
							this.pridepocketUser = <User>response.data()
							console.log("got an existing user from the database")
						}
						else {
							let { uid, displayName, phoneNumber, email } = user
							if (this.displayName) displayName = this.displayName
							db.collection("users").doc(uid).set({ uid, displayName, phoneNumber, email, new: true })
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
			},
			e => console.log("error handling facebook or google signin")
		)
	}

	// handleEmailSignin (onAuthStateChanged) {
	handleEmailSignin () {
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				// get the user's profile from the firestore and save it in pridepocketUser
				db.collection("users").doc(user.uid).get()
					.then(response => {
						// if the user exists in the database, then populate this.pridepocketUser with the DB representation
						if (response.exists) {
							this.pridepocketUser = <User>response.data()
							// console.log("got an existing user from the database")
						}
						
						// if the user does not exist in the database, then create a new user with the authentication data returned from firebase
						else {
							let { uid, displayName, phoneNumber, email } = user
							
							// set the displayName variable if it exists; this is used for displaying the user's name in the navigation bar
							//  this is redundant and probably going away
							if (this.displayName) displayName = this.displayName
							db.collection("users").doc(uid).set({ uid, displayName, phoneNumber, email, new: true })
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
		const o: Observable<firebase.auth.UserCredential> = fromPromise(firebase.auth().signInWithPopup(provider))
		
		this.handleCallback(this.extractUser(o))

	}
	
	google (): void {
		const provider = new firebase.auth.GoogleAuthProvider()
		const o: Observable<firebase.auth.UserCredential> = fromPromise(firebase.auth().signInWithPopup(provider))
		
		this.handleCallback(this.extractUser(o))
	}
	
	email (email, password): void {
		firebase.auth().signInWithEmailAndPassword(email, password)
		// const o = firebase.auth().onAuthStateChanged
		this.handleEmailSignin()
	}
	
	emailSignup (email, password, displayName): void {
		this.displayName = displayName
		const a = fromPromise(firebase.auth().createUserWithEmailAndPassword(email, password))
		
		return new Observable(observer => {
			a.subscribe(
				() => {
					this.handleEmailSignin()
					observer.next("creating user")
				},
				e => observer.error(e),
				() => {
					console.log("user created")
					observer.complete()
				}
			)
		})
	}
	
	signOut (): void {
		firebase.auth().signOut().then(() => {
			this.pridepocketUser = undefined
		}).catch(error => console.log("an error occurred while signing out", error))
	}
}

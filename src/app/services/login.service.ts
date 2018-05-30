import { Injectable } from '@angular/core'
import { Router } from '@angular/router'

import { fromPromise } from 'rxjs/observable/fromPromise'
import { from } from 'rxjs/observable/from'

import { Observable } from 'rxjs/Observable'
import { tap, map } from 'rxjs/operators'


// import { pipe } from 'rxjs/util/pipe'


import { User } from '../objects/UserInterfaces' // , UserUpdateObject
// import { User } from '../objects/User'

import { firebase, db } from '../utilities/utilities'




const extractUid = (response: Observable<any>): Observable<any> => {
	return new Observable(observer => {
		response.subscribe(
			user => {
				observer.next(user)
				observer.complete()
			},
			e => {
				console.log("error extracting uid from firebase auth: ", e)
				observer.error(e)
			}
		)
	})
}

const getDBUser = (response: Observable<any>): Observable<any> => {
	return new Observable(observer => {
		response.subscribe(
			user => {
				if (user) fromPromise(db.collection("users").doc(user.uid).get())
					.subscribe(
						u => observer.next(u.data()),
						e => observer.error(e),
						() => observer.complete()
					)
				else {
					observer.next()
					observer.complete()
				}
			},
			e => observer.error(e)
		)
	})
}



@Injectable()
export class LoginService {

	pridepocketUser: User
	loading: boolean
	displayName: string
	previous: string = "/"
	status
	
	constructor(
		private router: Router
	) {
		this.loading = true
		
		this.statusUpdater()
			.subscribe(
				v => { this.status = v },
				e => console.log("error in login constructor: ", e),
				() => {
					console.log("status updater completed; setting loading to false")
					this.loading = false
					
					// console.log("email verified? ", firebase.auth().currentUser.emailVerified)
					// console.log(firebase.auth().currentUser.providerId)
				}
			)
	}

	extractUser = map((response: firebase.auth.UserCredential) => <firebase.User>response.user)

	initialize () { return new Observable(observer => firebase.auth().onAuthStateChanged(observer)) }

	statusUpdater () {
		this.loading = true
		return new Observable(observer => {
			this.initialize().pipe(
				tap((o) => observer.next(o)),
				extractUid,
				tap((o) => observer.next(o)),
				getDBUser,
				tap((o) => this.pridepocketUser = o)
			)
				.subscribe(
					u => observer.next(u),
					e => observer.error(e),
					() => {
						this.loading = false
						observer.complete()
					}
				)
		})
	}

	loggedIn (): boolean { return !!this.pridepocketUser }

	// setPrevious (previous): void { this.previous = previous }

	/*
		var auth = firebase.auth();
		var emailAddress = "user@example.com";
		
		auth.sendPasswordResetEmail(emailAddress).then(function() {
		  // Email sent.
		}).catch(function(error) {
		  // An error happened.
		});
	*/

	sendPasswordResetEmail () {
		
	}

	// create a /confirmEmail component that waits for login then fires this function, then closes after 5 seconds
	// confirmEmail (): void {
	// 	console.log(firebase.auth().currentUser)
		
	// 	this.handleCallback(
	// 		from([firebase.auth().currentUser])
	// 	)
	// }

	handleCallback (observable: Observable<firebase.User>): void {
		// inject a spinner service on the constructor and trigger it here
		
		observable.subscribe(
			user => {
				// get the user's profile from firestore and save it in pridepocketUser
				db.collection("users").doc(user.uid).get()
					.then(response => {
						if (response.exists) {
							this.pridepocketUser = <User>response.data()
							this.router.navigateByUrl("/landing")
							console.log("this is an existing user")
						}
						else {
							let { uid, displayName, phoneNumber, email } = user
							if (this.displayName) displayName = this.displayName
							db.collection("users").doc(uid).set({ uid, displayName, phoneNumber, email, new: true })
								.then(() => {
									this.pridepocketUser = { uid, displayName, phoneNumber, email }
									console.log("this is a new user") //	, this.pridepocketUser
									this.router.navigateByUrl("/landing")
								})
								.catch(e => console.log("error while creating a new user in the database", e))
						}
					})
					.catch(e => console.log("error while fetching a user from the database", e))
	
				// kill the spinner
				
				// route to the page the user started at?
				// this.router.navigateByUrl(this.previous)
			},
			e => console.log("error handling signin")
		)
	}

	// providerFunction = {
	// 	facebook: "signInWithPopup",
	// 	google: "signInWithPopup",
	// 	email: "signInWithEmailAndPassword"
	// }

	authProviders = {
		facebook: new firebase.auth.FacebookAuthProvider(),
		google: new firebase.auth.GoogleAuthProvider()
	}
	
	reauthProviders = {
		facebook: new firebase.auth.FacebookAuthProvider(),
		google: new firebase.auth.GoogleAuthProvider(),
		email: firebase.auth.EmailAuthProvider
	}

	auth (provider: string, options = null): void {
		// const f = this.providerFunction[provider]
		let p

		if (provider !== 'email') {
			p = this.authProviders[provider]
			this.handleCallback(
				this.extractUser(
					fromPromise(
						firebase.auth().signInWithPopup(p)
					)
				)
			)
		}
		else this.handleCallback(fromPromise(firebase.auth().signInWithEmailAndPassword(options.email, options.password)))
	}
	
	reauth (provider: string, options = null): Observable<any> {
		// console.log(options)
		
		const p = this.reauthProviders[provider]
		if (provider === "email") { return fromPromise(
			firebase
				.auth().currentUser
					.reauthenticateWithCredential(
						p.credential(
							options.email, options.password
						)
					)
		) }
		else return fromPromise(
			firebase
				.auth().currentUser
					.reauthenticateWithPopup(p)
		)
	}
	
	/*
	emailSignup (email, password, displayName): Observable<any> {
		this.displayName = displayName
		return new Observable(observer => { this.handleCallback(fromPromise(firebase.auth().createUserWithEmailAndPassword(email, password))) })
	}
	*/

	sendVerification (user) {
		return fromPromise(user.sendEmailVerification())
	}

	//	email signup should require user to verify their email
	//	"You can customize the email template that is used in Authentication section of the Firebase console, on the Email Templates page. See Email Templates in Firebase Help Center."
	emailSignup (email, password, displayName): Observable<any> {
		return new Observable(observer => fromPromise(firebase.auth().createUserWithEmailAndPassword(email, password))
			.subscribe(
				user => {
					// { url: "https://pridepocket-3473b.firebaseapp.com/confirm" }
					this.sendVerification(user)
						.subscribe(
							() => console.log("flash a message that asks the user to confirm their email"),
							e => {
								observer.error(e)
								console.log("error sending email verification", e)
							},
							() => {
								console.log("email verification sent")
								observer.next()
								observer.complete()
							}
						)
				},
				e => observer.error(e),
				() => console.log("created user with email/password")
			)
		)
	}
	
	signOut (): void {
		firebase.auth().signOut()
			.then(() => { this.pridepocketUser = undefined })
			.catch(error => console.log("an error occurred while signing out", error))
	}
}

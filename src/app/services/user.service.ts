import { Injectable } from '@angular/core';

import { fromPromise } from 'rxjs/observable/fromPromise'
import { from } from 'rxjs/observable/from'

import { Observable } from 'rxjs/Observable'
// import { Router } from '@angular/router'
import { LoginService } from './login.service'

import { db, firebase } from '../utilities/utilities'

import { User, UserUpdateObject } from '../objects/UserInterfaces'
import { Donation } from '../objects/Donation'

interface firebaseUpdateInterface {
	photoURL: string
	displayName: string
}

const firebasePassword = (password: string) => (response: Observable<any>): Observable<any> => {
	console.log("firebasePassword", password)
	
	return new Observable(observer => {
		response.subscribe(
			() => console.log("subscribed to observer in pipeline"),
			e => console.log("error in pipeline: ", e),
			() => {
				console.log("in firebasePassword observable")
				fromPromise(firebase.auth().currentUser.updatePassword(password))
					.subscribe(
						() => {
							console.log("password is changed")
							observer.next()
						},
						e => observer.error(e),
						() => observer.complete()
					)
			}
		)
	})
}

const firebaseEmail = (email: string) => (response: Observable<any>): Observable<any> => {
	return new Observable(observer => {
		response.subscribe(
			() => console.log("subscribed to observer in pipeline"),
			e => console.log("error in pipeline: ", e),
			() => {
				fromPromise(firebase.auth().currentUser.updateEmail(email))
					.subscribe(
						() => observer.next(),
						e => observer.error(e),
						() => observer.complete()
					)
			})
	})
}

const firebaseProfile = (profile: { displayName: string, photoURL: string }) => (response: Observable<any>): Observable<any> => {
	return new Observable(observer => {
		response.subscribe(
			() => console.log("subscribed to observer in pipeline"),
			e => console.log("error in pipeline: ", e),
			() => {
				console.log(profile)
				
				fromPromise(firebase.auth().currentUser.updateProfile(profile))
					.subscribe(
						() => observer.next(),
						e => observer.error(e),
						() => observer.complete()
					)
			}
		)
	})
}

const saveToDb = (update: UserUpdateObject, uid: string) => (response: Observable<any>): Observable<any> => {
	return new Observable(observer => {
		response.subscribe(
			() => console.log("subscribed to observer in pipeline"),
			e => console.log("error in pipeline: ", e),
			() => {
				fromPromise(db.collection("users").doc(uid).set(update, { merge: true }))
					.subscribe(
						() => observer.next(),
						e => observer.error(e),
						() => observer.complete()
					)
			}
		)
	})
}

@Injectable()
export class UserService {
	constructor(
		private login: LoginService
	) { }
	
	user: User = this.login.pridepocketUser
	displayName: string = ""
	email: string = ""

	modifyUser (update: UserUpdateObject): Observable<any> {
		const profile = { displayName: update.displayName, photoURL: update.profile_pic.url }
		const { password, email } = update

		if (!update["profile_pic"].url) { delete update.profile_pic }
		delete update.password

		// console.log(update)
		// console.log(password)

		for (let v in update) { if (this.login.pridepocketUser[v] === update[v]) delete update[v] }

		let pipeline = []

		if (password) pipeline.push(firebasePassword(password))
		if (update.displayName || update.profile_pic) pipeline.push(firebaseProfile(profile))
		if (email) pipeline.push(firebaseEmail(email))
		pipeline.push(saveToDb(update, this.login.pridepocketUser.uid))

		return from([update])
			.pipe(...pipeline)
	}
	
	getDonations (): Observable<Donation> { return from(Object.values(this.login.pridepocketUser.donations || {})) }
	deactivate (): Observable<void> { return fromPromise(db.collection("users").doc(this.login.pridepocketUser.uid).set({ active: false }, { merge: true })) }
}

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


// fOR PASSWORD AND EMAIL CHANGES, USER MUST RE-AUTHENTICATE USING THEIR SIGN-IN METHOD OF CHOICE


const firebasePassword = (update: UserUpdateObject) => (response: Observable<any>): Observable<any> => {
	return new Observable(observer => {
		fromPromise(firebase.auth().currentUser.updatePassword(update.password))
			.subscribe(
				() => observer.next(),
				e => observer.error(e),
				() => observer.complete()
			)
	})
}

const firebaseEmail = (update: UserUpdateObject) => (response: Observable<any>): Observable<any> => {
	return new Observable(observer => {
		fromPromise(firebase.auth().currentUser.updateEmail(update.email))
			.subscribe(
				() => observer.next(),
				e => observer.error(e),
				() => observer.complete()
			)
	})
}

const firebaseProfile = (update: UserUpdateObject) => (response: Observable<any>): Observable<any> => {
	return new Observable(observer => {
		const { displayName, profile_pic } = update
		
		let u: firebaseUpdateInterface = { displayName, photoURL: profile_pic ? profile_pic.url : null }
		let x = {}
		
		for ( let v in u ) {
			if (u[v]) { x[v] = u[v] }
			else { x[v] = firebase.auth().currentUser[v] }
		}
		
		fromPromise(firebase.auth().currentUser.updateProfile(x))
			.subscribe(
				() => observer.next(),
				e => observer.error(e),
				() => observer.complete()
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
	
	modifyUser (update: UserUpdateObject): Observable<void> {
		if (!update["profile_pic"].url) {
			console.log("profile_pic is empty; deleting")
			delete update.profile_pic
		}
		
		for (let v in update) { if (firebase.auth().currentUser[v] === update[v]) delete update[v] }
		
		// return new Observable(observer => {
		// 	if (true) observer.next()
		// 	else observer.error()
			
		// 	observer.complete()
		// })
	
		let pipeline = []
	
		if (update.password) pipeline.push(firebasePassword(update))
		if (update.displayName || update.profile_pic) pipeline.push(firebaseProfile(update))
		if (update.email) pipeline.push(firebaseEmail(update))
		
		return fromPromise(db.collection("users").doc(this.login.pridepocketUser.uid).set(update, { merge: true })).pipe(...pipeline)
	

	}
	
	getDonations (): Observable<Donation> { return from(Object.values(this.login.pridepocketUser.donations || {})) }
	deactivate (): Observable<void> { return fromPromise(db.collection("users").doc(this.login.pridepocketUser.uid).set({ active: false }, { merge: true })) }
}

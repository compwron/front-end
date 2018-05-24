import { Injectable } from '@angular/core';

import { fromPromise } from 'rxjs/observable/fromPromise'
import { from } from 'rxjs/observable/from'
import { Observable } from 'rxjs/Observable'
// import { Router } from '@angular/router'
import { LoginService } from './login.service'

import { db } from '../utilities/utilities'

import { User, UserUpdateObject } from '../objects/UserInterfaces'
import { Donation } from '../objects/Donation'

@Injectable()
export class UserService {
	constructor(
		private login: LoginService
	) { }
	
	user: User = this.login.pridepocketUser
	displayName: string = ""
	email: string = ""
	
	modifyUser (update: UserUpdateObject): Observable<void> {
		this.user = this.login.pridepocketUser
		console.log(update)
		return fromPromise(db.collection("users").doc(this.user.uid).set(update, { merge: true }))
		
	}
	getDonations (): Observable<Donation> {
		this.user = this.login.pridepocketUser
		return from(Object.values(this.user.donations || {}))
	}
	deactivate (): Observable<void> { return fromPromise(db.collection("users").doc(this.user.uid).set({ active: false }, { merge: true })) }
}

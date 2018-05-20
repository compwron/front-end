import { Injectable } from '@angular/core';

// import { HttpClient } from '@angular/common/http'
// import { HttpHeaders } from '@angular/common/http'
// import { HttpEvent } from '@angular/common/http'
// import { HttpParams } from '@angular/common/http'

import { fromPromise } from 'rxjs/observable/fromPromise'
import { from } from 'rxjs/observable/from'
import { Observable } from 'rxjs/Observable'
// import { Router } from '@angular/router'
import { LoginService } from './login.service'

import { pipe } from 'rxjs/util/pipe'

import { db, firebase } from '../utilities/utilities'

import { User, UserUpdateObject } from '../objects/UserInterfaces'
import { Donation } from '../objects/Donation'

@Injectable()
export class UserService {
	constructor(
		private login: LoginService
	) { }
	
	user: User
	
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

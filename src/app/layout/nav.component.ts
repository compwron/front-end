import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service'
import { Router } from '@angular/router'

import { first } from 'rxjs/operators'

import { firebase } from '../utilities/utilities'

import { User } from '../objects/UserInterfaces'

@Component({
  selector: 'nav-pp',
  templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit {
	constructor (
		private login: LoginService,
		private router: Router
	) {}

	email: string = null
	user: User
	confirmed: boolean
	pending: string
	
	ngOnInit () {
		if (this.login.loading) {
			const unsubscribe = setInterval(() => {
				if(!this.login.loading) {
					if (this.login.pridepocketUser) {
						this.email = this.login.pridepocketUser.email
						this.confirmed = firebase.auth().currentUser.emailVerified
					}
				}
				
			}, 1000)
		}
		else { this.email = this.login.pridepocketUser.email }
	}
	
	loggedIn (): boolean { return this.login.loggedIn() }
	
	resendVerificationEmail (): void {
		console.log("resendig verification email")
		this.login.sendVerification(firebase.auth().currentUser)
			.subscribe(
				() => {
					this.pending = "The verification link has been resent, please check your inbox"
					console.log("link sent")
				},
				e => console.log("error sending verfication link", e)
			)
	}
	
	signOut (): void {
		this.email = null
		this.login.signOut()
	}
}
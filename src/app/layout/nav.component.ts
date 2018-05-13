import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service'
import { ChangeDetectorRef } from '@angular/core'


@Component({
  selector: 'nav-pp',
  templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit {
	constructor (
		private login: LoginService,
		private refresh: ChangeDetectorRef
	) {}

	email: string
	
	ngOnInit () {
		console.log("nav bar init running")
		if (this.login.loading) {
			this.login.wait()
				.subscribe(
					b => {
						this.login.pendingUser
							.subscribe(
								user => {
									this.email = user.data().email
									this.refresh.detectChanges()
								},
								e => console.log("error getting user from login service", e)
							)
					},
					e => console.log("error in this.login.wait", e)
				)
		}
		else {
			this.email = this.login.pridepocketUser.email
		}
	}
	
	loggedIn (): boolean { return this.login.loggedIn() }
	signOut (): void {
		this.email = null
		this.login.signOut()
	}
}
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
		if (this.login.loading) { this.waitForLogin() }
		else { this.email = this.login.pridepocketUser.email }
	}
	
	waitForLogin () {
		this.login.wait().subscribe(
			b => { if (b) this.login.pendingUser.subscribe(this.setEmail()) },
			e => console.log("error in this.login.wait", e)
		)
	}
	
	setEmail () {
		return ({
			next: user => {
				this.email = user.data().email
				this.refresh.detectChanges()
			},
			error: e => console.log("error getting user from login service", e)
		})
	}
	
	loggedIn (): boolean { return this.login.loggedIn() }
	
	signOut (): void {
		this.email = null
		this.login.signOut()
	}
}
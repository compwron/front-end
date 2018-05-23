import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service'
import { ChangeDetectorRef } from '@angular/core'
import { Router } from '@angular/router'

import { first } from 'rxjs/operators'

@Component({
  selector: 'nav-pp',
  templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit {
	constructor (
		private login: LoginService,
		private refresh: ChangeDetectorRef,
		private router: Router
	) {}

	email: string = null
	
	ngOnInit () {
		if (this.login.loading) { this.waitForLogin() }
		else { this.email = this.login.pridepocketUser.email }
	}
	
	waitForLogin () { this.login.statusUpdater().pipe(first()).subscribe(this.setEmail()) }
	
	setEmail () {
		return ({
			next: user => {
				if (user) { this.email = user.email }
				else { this.router.navigateByUrl('/login') }
				
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
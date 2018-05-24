import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service'
import { Router } from '@angular/router'

import { first } from 'rxjs/operators'

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
	
	ngOnInit () {
		if (this.login.loading) {
			const unsubscribe = setInterval(() => {
				if(!this.login.loading) {
					if (this.login.pridepocketUser) this.email = this.login.pridepocketUser.email
					// else this.router.navigateByUrl('/login')
				}
				
			}, 1000)
		}
		else { this.email = this.login.pridepocketUser.email }
	}
	
	loggedIn (): boolean { return this.login.loggedIn() }
	
	signOut (): void {
		this.email = null
		this.login.signOut()
	}
}
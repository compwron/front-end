import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service'
import { ChangeDetectorRef } from '@angular/core'


@Component({
  selector: 'nav-pp',
  templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit {
	constructor (
		private loginService: LoginService,
		private refresh: ChangeDetectorRef
	) {}

	email: string
	
	ngOnInit () {
		const f = user => {
			this.email = this.loginService.pridepocketUser.email
			this.refresh.detectChanges()
		}
		
		this.loginService.initialize(f)
	}
	
	testLogin (): void {
		console.log("pridepocketUser (should not be null if logged in): ", this.loginService.pridepocketUser)
	}
	
	loggedIn (): boolean { return this.loginService.loggedIn() }
	signOut (): void {
		this.email = null
		this.loginService.signOut()
	}
}
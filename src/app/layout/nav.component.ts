import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service'

@Component({
  selector: 'nav-pp',
  templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit {
	constructor (
		private loginService: LoginService
	) {}
	
	loggedIn (): bool {
		console.log("checking login: ", this.loginService.loggedIn())
		return this.loginService.loggedIn()
	}
	
	signOut (): void { this.loginService.signOut() }
}
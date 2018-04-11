import { Component, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms'

import { LoginService } from '../../../services/login.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	constructor(
		private loginService: LoginService
	) { }
	
	email:string
	password:string
	
	onLogin(form: NgForm) {
		console.log(form.value)
	}
	
	facebook (): void {
		console.log("tried to login with facebook")
		this.loginService.facebook()
	}
	google (): void {
		// console.log("tried to login with google")
		if (!this.loginService.loggedIn()) this.loginService.google()
		else console.log("you're already logged in")
	}
	// emailLogin (uin, pw): void {
	emailLogin (form: NgForm): void {
		let { email, password } = form.value
		console.log("tried to login with uin/pw")
		this.loginService.email(uin, pw)
	}
	
	ngOnInit() {
	}
	
}

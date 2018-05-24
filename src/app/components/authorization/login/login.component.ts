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

	ngOnInit() {
	}
	
	email:string
	password:string
	ptype: boolean = true
	error: { code: string, message: string}
	
	
	loggedIn: { code: string, message: string} = { code: "double login", message: "You are already logged in!" }
	// onLogin(form: NgForm) {
	// 	console.log(form.value)
	// }
	
	
	// add the error handler that spits out login error-related messages
	
	/*
			error: { code: string, message: string }
	
    		e => {
    			this.error = e
    			setTimeout(() => this.error = null, 10000)
			},
	*/
	
	facebook (): void {
		console.log("tried to login with facebook")
		if (!this.loginService.loggedIn()) this.loginService.facebook()
		else {
			this.error = this.loggedIn
			setTimeout(() => this.error = null, 10000)
		}
		
	}
	google (): void {
		// console.log("tried to login with google")
		if (!this.loginService.loggedIn()) this.loginService.google()
		else {
			this.error = this.loggedIn
			setTimeout(() => this.error = null, 10000)
		}
	}
	// emailLogin (uin, pw): void {
	emailLogin (form: NgForm): void {
		let { email, password } = form.value
		console.log("tried to login with uin/pw")
		if (!this.loginService.loggedIn()) this.loginService.email(email, password)
		else {
			this.error = this.loggedIn
			setTimeout(() => this.error = null, 10000)
		}
	}
	
	passwordType () { return this.ptype ? "password" : "text" }
	togglePasswordVisible () { this.ptype = !this.ptype }
	
}

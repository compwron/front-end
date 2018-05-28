import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
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

	ngOnInit() {}
	
	@Input() reauth: boolean = false
	@Output() reauthComplete = new EventEmitter<any>()
	
	email:string
	password:string
	ptype: boolean = true
	error: { code: string, message: string}
	
	
	loggedIn: { code: string, message: string} = { code: "double login", message: "You are already logged in!" }
	
	// add the error handler that spits out login error-related messages
	
	/*
			error: { code: string, message: string }
	
    		e => {
    			this.error = e
    			setTimeout(() => this.error = null, 10000)
			},
	*/
	
	beginAuth (provider: string, form: NgForm = null) { this.reauth ? this.reauthenticate(provider, form) : this.auth(provider, form) }
	
	auth (provider, options: NgForm = null): void {
		if (!this.loginService.loggedIn() && !options) this.loginService.auth(provider)
		else if (!this.loginService.loggedIn()) this.loginService.auth(provider, options.value)
		else {
			this.error = this.loggedIn
			setTimeout(() => this.error = null, 10000)
		}
	}
	
	reauthenticate (provider, options: NgForm = null): void {
		// console.log(`tried to reauth with ${provider}`, console.log(options))

		const observer = {
			next: () => console.log("reauthentication successful"),
			error: e => {
				this.error = e
				setTimeout(() => this.error = null, 10000)
				this.reauthComplete.emit(false)
			},
			complete: () => this.reauthComplete.emit(true)
		}
		
		if (!options) this.loginService.reauth(provider).subscribe(observer)
		else this.loginService.reauth(provider, options.value).subscribe(observer)
	}
	
	// facebook (): void {
	// 	console.log("tried to login with facebook")
	// 	if (!this.loginService.loggedIn()) this.loginService.facebook()
	// 	else {
	// 		this.error = this.loggedIn
	// 		setTimeout(() => this.error = null, 10000)
	// 	}
		
	// }
	// google (): void {
	// 	// console.log("tried to login with google")
	// 	if (!this.loginService.loggedIn()) this.loginService.google()
	// 	else {
	// 		this.error = this.loggedIn
	// 		setTimeout(() => this.error = null, 10000)
	// 	}
	// }
	// // emailLogin (uin, pw): void {
	// emailLogin (form: NgForm): void {
	// 	let { email, password } = form.value
	// 	console.log("tried to login with uin/pw")
	// 	if (!this.loginService.loggedIn()) this.loginService.email(email, password)
	// 	else {
	// 		this.error = this.loggedIn
	// 		setTimeout(() => this.error = null, 10000)
	// 	}
	// }
	
	passwordType () { return this.ptype ? "password" : "text" }
	togglePasswordVisible () { this.ptype = !this.ptype }
	
}

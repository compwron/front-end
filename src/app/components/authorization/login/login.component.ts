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
	
	// onLogin(form: NgForm) {
	// 	console.log(form.value)
	// }
	
	facebook (): void {
		console.log("tried to login with facebook")
		if (!this.loginService.loggedIn()) this.loginService.facebook()
		else console.log("you're already logged in")
		
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
		if (!this.loginService.loggedIn()) this.loginService.email(email, password)
		else console.log("you're already logged in")
	}
	
	passwordType () { return this.ptype ? "password" : "text" }
	togglePasswordVisible () { this.ptype = !this.ptype }
	
}

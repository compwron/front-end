import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Router } from '@angular/router'

import { LoginService } from '../../../services/login.service'


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
	displayName:string;
	email:string;
	password:string;
	ptype: boolean = true
	error: { code: string, message: string }
	message: string

	constructor(
		private loginService: LoginService,
		private router: Router
	) { }

	onSignUp(form:NgForm) {
		let { displayName, email, password } = form.value
		this.loginService.emailSignup(email, password, displayName)
			.subscribe(
				message => {
					setTimeout(() => {
						this.message = null
						this.router.navigateByUrl("/login")
					}, 10000)
					this.message = "Check your email before you try to sign in; we sent you a link to verify your account; redirecting you to the login page soon"
					this.displayName = null
					this.email = null
					this.password = null
				},
				e => {
					this.error = e
					setTimeout(() => this.error = null, 10000)
				},
				() => console.log("signup complete")
			)
	}

	ngOnInit() {
	}

	passwordType () { return this.ptype ? "password" : "text" }
	togglePasswordVisible () { this.ptype = !this.ptype }

}

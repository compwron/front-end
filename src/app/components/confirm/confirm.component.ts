import { Component, OnInit } from '@angular/core';

import { LoginService } from '../../services/login.service'

import { firebase } from '../../utilities/utilities'

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
	
	constructor(
		private login: LoginService
	) { }
	
	message: string
	
	ngOnInit() {
		this.message = "Your email address is confirmed; you can log into PridePocket now!"

		setTimeout(() => {
			console.log("closing window")
			this.close()
		}, 3000)
		// const unsubscribe = setInterval(() => {
		// 	if (!this.login.loading && this.login.loggedIn()) {
		// 		console.log(firebase.auth().currentUser.emailVerified)
		// 		if (firebase.auth().currentUser.emailVerified) {
		// 			this.message = "Confirmed your email, finishing the account creation process"
		// 			this.login.confirmEmail()
		// 		}
		// 		else this.message = "You email is not verified; something went wrong..."
				
		// 		clearInterval(unsubscribe)
		// 	}
		// 	else if (!this.login.loading) this.message = "Could not confirm your email..."
		// }, 1000)

	}
	
	close () { window.close() }

}

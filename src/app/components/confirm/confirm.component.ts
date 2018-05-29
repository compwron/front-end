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
		this.message = "Confirming your email address..."
		const unsubscribe = setInterval(() => {
			if (!this.login.loading && this.login.loggedIn()) {
				if (firebase.auth().currentUser.emailVerified) {
					this.message = "Confirmed your email, finishing the account creation process"
					this.login.confirmEmail()
				}
				else this.message = "You email is not verified; something went wrong..."
				
				clearInterval(unsubscribe)
			}
			else if (!this.login.loading) this.message = "Could not confirm your email..."
		}, 1000)

	}

}

import { Component, OnInit } from '@angular/core';

import { LoginService } from '../../services/login.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
	
	constructor(
		private login: LoginService,
		private router: Router
	) { }
	
	ngOnInit() {
		console.log("in landing page")
		this.checkUserStatus()
	}
	
	checkUserStatus () {
		console.log("in checkUserStatus")
		this.login.wait()
			.subscribe(
				user => {
					console.log("pendingUser: ", this.login.pendingUser)
					this.login.pendingUser.subscribe(this.redirect())
				},
				e => console.log("error logging in/getting user"),
				() => console.log("checkUserStatus subscription to login.wait completed")
			)
	}
	
	redirect () {
		return ({
			next: user => {
				const u = user.data()
				if (u.new) {
					console.log("user is new:", u)
					console.log("user is new:", this.login.pridepocketUser)
					this.router.navigateByUrl('/account')
				}
				else {
					console.log("user is new:", u)
					console.log("user is new:", this.login.pridepocketUser)
					this.router.navigateByUrl('/mycampaigns')
				}
			},
			error: e => console.log("error redirecting", e)
		})
		
	}

}

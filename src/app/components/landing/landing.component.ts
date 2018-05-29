import { Component, OnInit } from '@angular/core';

import { LoginService } from '../../services/login.service'
import { Router } from '@angular/router'

import { User } from '../../objects/UserInterfaces'

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
	
	user
	
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
		this.login.statusUpdater()
			.subscribe(
				user => {
					if (!this.user) this.router.navigateByUrl('/campaigns')
					this.user = user
				},
				e => console.log("error logging in/getting user", e),
				() => this.user.new ? this.router.navigateByUrl('/account') : this.router.navigateByUrl('/mycampaigns')
			)
	}

}

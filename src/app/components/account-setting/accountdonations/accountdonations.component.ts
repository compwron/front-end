import { Component, OnInit } from '@angular/core'

import { UserService } from '../../../services/user.service'

import { Donation } from '../../../objects/Donation'

@Component({
	selector: 'app-accountdonations',
	templateUrl: './accountdonations.component.html',
	styleUrls: ['./accountdonations.component.scss']
})
export class AccountdonationsComponent implements OnInit {

	donations: Donation[] = []

	constructor(
		private user: UserService
	) { }

	ngOnInit() {
		this.getDonations()
	}
	
	getDonations () {
		this.user.getDonations()
			.subscribe(
				(donation: Donation): void => this.donations.push(donation),
				(e): void => console.log("error getting donations off user", e),
				(): void => console.log("completed getting donations off user")
			)
	}

}

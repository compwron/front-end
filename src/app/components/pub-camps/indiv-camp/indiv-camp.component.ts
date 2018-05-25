import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { LoginService } from '../../../services/login.service'
import { CampaignOneService } from '../../../services/campaign-one.service'
import { ChangeDetectorRef } from '@angular/core'

import { Campaign } from '../../../objects/Campaign'
import { User } from '../../../objects/UserInterfaces'

import { first } from 'rxjs/operators'

@Component({
  selector: 'app-indiv-camp',
  templateUrl: './indiv-camp.component.html',
  styleUrls: ['./indiv-camp.component.scss']
})
export class IndivCampComponent implements OnInit {
	campaign: object
	user: object = {}
	displayEnd
	
	constructor(
		private campaignOneService: CampaignOneService,
		private route: ActivatedRoute,
		private login: LoginService,
		private refresh: ChangeDetectorRef
	) {}
	
	ngOnInit() {
		this.getCampaign()
		this.login.statusUpdater()
			.subscribe(
				u => console.log("logging in...."),
				e => console.log("login error: ", e),
				() => {
					this.user = this.login.pridepocketUser
					this.refresh.detectChanges()
				}
			)
		
	}

	objectkeys = Object.keys
	
	getCampaign (): void {
		const id = this.route.snapshot.paramMap.get('id')
		this.campaignOneService.get(id)
			.subscribe(
				campaign => {
					this.campaign = campaign
					if (this.campaign.end) this.displayEnd = this.campaign.end.toDateString()
					else this.displayEnd = "(This campaign has no end date)"
				},
				e => console.log("error getting campaign snapshot: ", e),
				() => console.log("finished getting campaign snapshot")
			)
	}
}
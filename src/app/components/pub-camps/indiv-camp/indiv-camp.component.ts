import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { CampaignOneService } from '../../../services/campaign-one.service'
import { Campaign } from '../../../objects/Campaign'

@Component({
  selector: 'app-indiv-camp',
  templateUrl: './indiv-camp.component.html',
  styleUrls: ['./indiv-camp.component.scss']
})
export class IndivCampComponent implements OnInit {
	campaign: object
	
	constructor(
		private campaignOneService: CampaignOneService,
		private route: ActivatedRoute
	) { }
	
	ngOnInit() { this.getCampaign() }

	objectkeys = Object.keys
	
	getCampaign (): void {
		const id = this.route.snapshot.paramMap.get('id')
		this.campaignOneService.get(id, campaign => this.campaign = campaign)
	}
}
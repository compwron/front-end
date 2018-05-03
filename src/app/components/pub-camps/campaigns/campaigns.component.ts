import { Component, OnInit } from '@angular/core';

import { CampaignService } from '../../../services/campaign.service'
import { Campaign } from '../../../objects/Campaign'

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent implements OnInit {
	
	constructor(private campaignService: CampaignService) { }
	
	campaigns: Campaign[]
	
	ngOnInit() {
		this.getCampaigns()
	}

	getCampaigns (): void {
		this.campaignService.getCampaigns()
			.subscribe(
				campaigns => { this.campaigns = campaigns },
				e => console.log("error getting campaigns from DB: ", e),
				() => console.log("finished getting campaigns from DB")
			)
	}

}

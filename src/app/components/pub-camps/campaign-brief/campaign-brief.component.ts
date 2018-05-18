import { Component, OnInit, Input } from '@angular/core'

import { Campaign } from '../../../objects/Campaign'

// import { Campaign } from '../objects/Campaign'

@Component({
  selector: 'app-campaign-brief',
  templateUrl: './campaign-brief.component.html',
  styleUrls: ['./campaign-brief.component.scss']
})
export class CampaignBriefComponent implements OnInit {
	@Input() campaign: Campaign
	objectkeys = Object.keys
	
	percent: number = 0
	
	constructor() { }
	
	ngOnInit() {
		this.percent = Math.floor(this.campaign.current/this.campaign.goal*100)
		this.percent = this.percent > 100 ? 100 : this.percent
		
		this.percentStyle = {
			height: "100%",
			width: this.percent,
			'background-color': "green",
			'border-radius': "100px"
		}
	}

}

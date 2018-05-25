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
	
	ngOnInit() { this.getCampaigns() }

	sorter = {
		"newest": (a, b) => {
			let ac, bc
			
			if (!a.begin) ac = 0
			else ac = a.begin.valueOf()
			if (!b.begin) bc = 0
			else bc = b.begin.valueOf()

			return bc - ac
		},
		"popularity": (a, b) => {
			let ac, bc
			if (!a.received) ac = 0
			else ac = Object.values(a.received).length
			
			if (!b.received) bc = 0
			else bc = Object.values(b.received).length
			
			console.log(ac, bc, a.name, b.name)
			
			return bc - ac
		},
		// this filter works correctly
		"ending soonest": (a, b) => {
			let ac, bc
			
			if (!a.end) ac = 0
			else ac = a.end.valueOf()
			if (!b.end) bc = 0
			else bc = b.end.valueOf()

			return bc - ac
		},
		"closest to goal": (a, b) => b.current/b.goal - a.current/a.goal
	}

	sort (key) {
		console.log(this.campaigns.map(c => c.name))
		
		// console.log(key)
		this.campaigns.sort(this.sorter[key])
		
		console.log(this.campaigns.map(c => c.name))
	}

	getCampaigns (): void {
		this.campaignService.subscribeCampaigns({ field: "active", operator: "==", value: true })
			.subscribe(
				campaigns => {this.campaigns = campaigns },
				e => console.log("error getting campaigns from DB: ", e)
			)
	}

}

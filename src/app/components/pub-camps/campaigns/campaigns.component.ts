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
			
			if (!a.end) ac = 0
			else ac = a.end.valueOf()
			if (!b.end) bc = 0
			else bc = b.end.valueOf()

			return ac - bc
		},
		"popularity": (a, b) => {
			let ac, bc
			if (!a.received) ac = 0
			else ac = Object.values(a.received).length
			
			if (!b.received) bc = 0
			else bc = Object.values(b.received).length
			
			console.log(ac, bc, a.name, b.name)
			
			return ac - bc
		},
		"ending soonest": (a, b) => {
			let ac, bc
			
			if (!a.end) ac = 0
			else ac = a.end.valueOf()
			if (!b.end) bc = 0
			else bc = b.end.valueOf()

			console.log(ac, bc, a.name, b.name)

			return ac - bc
		},
		"closest to goal": (a, b) => a.current/a.goal - b.current/b.goal
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

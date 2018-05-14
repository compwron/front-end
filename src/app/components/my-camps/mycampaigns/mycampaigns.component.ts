import { Component, OnInit } from '@angular/core';

import { ChangeDetectorRef } from '@angular/core'

import { CampaignService } from '../../../services/campaign.service'
import { Campaign } from '../../../objects/Campaign'

@Component({
  selector: 'app-mycampaigns',
  templateUrl: './mycampaigns.component.html',
  styleUrls: ['./mycampaigns.component.scss']
})
export class MycampaignsComponent implements OnInit {

	filters = {}
	campaigns: Campaign[] = []

	constructor(
		private campaignService: CampaignService,
		private refresh: ChangeDetectorRef
	) { }
	
	ngOnInit() { this.getCampaigns() }
	
	addFilter (e): void {
		const f = e.target.attributes.name.value
		const s = e.target.attributes.value.value
		
		Object.keys(this.filters).includes(f) ? delete this.filters[f] : this.filters[f] = s === 'true'

		this.refresh.detectChanges()
	}

	clearFilters (e): void { if(e.target.checked) this.filters = {} }

	/*
		- angular does shallow object comparison when checking for page updates, so it can't see changes to this.filters
		- it's a lot simpler to store the filters in an object map
		- this get function is the argument to the flexibleList pipe that filters campaigns
		- it returns an array, which change detection can handle
	*/
	get fs () { return Object.entries(this.filters).map(([k, v]) => [k, v]) }
	
	getCampaigns (): void {
		this.campaignService.getCampaigns()
			.subscribe(
				campaigns => { this.campaigns = campaigns },
				e => console.log("error getting campaigns from DB: ", e),
				() => console.log("finished getting campaigns from DB")
			)
	}

}

import { Component, OnInit, Input } from '@angular/core';

// import { Campaign } from '../objects/Campaign'

@Component({
  selector: 'app-campaign-brief',
  templateUrl: './campaign-brief.component.html',
  styleUrls: ['./campaign-brief.component.scss']
})
export class CampaignBriefComponent implements OnInit {
	@Input() campaign: Campaign
	objectkeys = Object.keys
	
	constructor() { }
	
	ngOnInit() {
	}

}

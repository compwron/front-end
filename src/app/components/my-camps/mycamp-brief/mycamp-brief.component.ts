import { Component, OnInit, Input } from '@angular/core'

import { Campaign } from '../../../objects/Campaign'

@Component({
  selector: 'app-mycamp-brief',
  templateUrl: './mycamp-brief.component.html',
  styleUrls: ['./mycamp-brief.component.scss']
})
export class MycampBriefComponent implements OnInit {
	@Input() campaign: Campaign
	
	src: string = "http://via.placeholder.com/141x141"
	
	constructor() { }
	
	ngOnInit() { this.src = this.campaign.banner.url }

	activate () {
		console.log("put this campaign into active mode")
	}

}
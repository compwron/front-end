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
	percent: number = 0
	percentStyle: {
		height: string
		width: string
		'background-color': string
		'border-radius': string
	}
	
	constructor() { }
	
	ngOnInit() {
		this.src = this.campaign.banner.url

		this.percent = Math.floor(this.campaign.current/this.campaign.goal*100)
		this.percent = this.percent > 100 ? 100 : this.percent
		
		this.percentStyle = {
			height: "100%",
			width: `${this.percent}%`,
			'background-color': "green",
			'border-radius': "100px"
		}
	}

	activate () {
		console.log("put this campaign into active mode")
	}

}
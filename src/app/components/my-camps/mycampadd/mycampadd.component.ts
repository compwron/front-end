import { Component, OnInit } from '@angular/core'
import { NgForm, FormArray, FormBuilder, FormGroup } from '@angular/forms'

import { CampaignCreatorService } from '../../../services/campaign-creator.service'
import { Campaign } from '../../../objects/Campaign'

@Component({
  selector: 'app-mycampadd',
  templateUrl: './mycampadd.component.html',
  styleUrls: ['./mycampadd.component.scss']
})
export class MycampaddComponent implements OnInit {
	
	constructor(
		private fb: FormBuilder,
		private create: CampaignCreatorService
	) {
		this.createForm()
		this.setAffiliate_links()
	}
	
	ngOnInit() {
	}
	
	createdForm: FormGroup
	campaign

	createForm () {
		this.createdForm = this.fb.group({
			name: "",
			type: "",
			goal: 0,
			noDate: false,
			end: 0,
			description: "",
			affiliate_links: this.fb.array([]),
			thankYou: "",
			fEmail: "",
			eMessage: "",
			shared: false
		})
		
		console.log(this.createdForm)
	}
	
	onAddCamp(form: NgForm) {
		console.log(this.createdForm.value)
		
		const campaign = this.prepareSaveCampaign()
		this.create.create(campaign)
			.subscribe(
				() => this.createdForm.reset(),
				e => console.log("error creating campaign", e),
				() => console.log("completed creating campaign")
			)
	}
	
	prepareSaveCampaign (): Campaign { return this.createdForm.value as Campaign }
	
	setAffiliate_links (): void {
		const affiliate_links = this.campaign.affiliate_links ? this.fb.array(this.campaign.affiliate_links) : this.fb.array([])
		this.createdForm.setControl('affiliate_links', affiliate_links)
	}
	get affiliate_links (): FormArray {
		return this.createdForm.get('affiliate_links') as FormArray
	}
	
	addAffiliate (): void { this.campaign.affiliate_links.push("") }

}

/*
	name:string
	type:string
	goal:number
	noDate:boolean
	end:number
	description:string
	affiliateLinks: string[]
	thankYou:string
	fEmail:string
	eMessage:string
	shared:boolean
*/
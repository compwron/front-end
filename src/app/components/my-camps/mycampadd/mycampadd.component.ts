import { Component, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'

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
			name: this.fb.control("", [Validators.required, Validators.minLength(12), Validators.maxLength(36), Validators.pattern("[a-zA-Z0-9 ]+")]),
			type: this.fb.control("", [Validators.required]),
			goal: this.fb.control(null, [Validators.required, Validators.min(1)]),
			noDate: false,
			end: this.fb.control(null, [Validators.required]),
			description: this.fb.control("", [Validators.pattern("[a-zA-Z0-9 ]+"), Validators.minLength(36), Validators.maxLength(1024)]),
			affiliate_links: this.fb.array([]),
			thankYou: "",
			fEmail: "",
			eMessage: "",
			shared: false,
			active: false
		})
	}
	
	createCampaign() {
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
		const affiliate_links = (this.campaign && this.campaign.affiliate_links) ? this.fb.array(this.campaign.affiliate_links) : this.fb.array([])
		this.createdForm.setControl('affiliate_links', affiliate_links)
	}
	
	set active (b: boolean) { this.createdForm.setValue("active", b) }
	
	get affiliate_links (): FormArray { return this.createdForm.get('affiliate_links') as FormArray }

	get name (): FormControl { return this.createdForm.get("name") as FormControl }
	get type (): FormControl { return this.createdForm.get("type") as FormControl }
	get goal (): FormControl { return this.createdForm.get("goal") as FormControl }
	get end (): FormControl { return this.createdForm.get("end") as FormControl }
	get description (): FormControl { return this.createdForm.get("description") as FormControl }
	
	
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
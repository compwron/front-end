import { Component, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'

import { ActivatedRoute } from '@angular/router'
import { ChangeDetectorRef } from '@angular/core'

import { CampaignCreatorService } from '../../../services/campaign-creator.service'
import { CampaignOneService } from '../../../services/campaign-one.service'
import { Campaign } from '../../../objects/Campaign'

@Component({
  selector: 'app-mycampadd',
  templateUrl: './mycampadd.component.html',
  styleUrls: ['./mycampadd.component.scss']
})
export class MycampaddComponent implements OnInit {
	constructor(
		private fb: FormBuilder,
		private create: CampaignCreatorService,
		private campaignGet: CampaignOneService,
		private route: ActivatedRoute,
		private refresh: ChangeDetectorRef
	) {
		this.createForm()
		
		this.setAffiliate_links()
		this.addAffiliateLink()
		this.addAffiliateLink()
		this.addAffiliateLink()
	}
	
	ngOnInit() {
		const id = this.route.snapshot.paramMap.get('id')
		
		// if the URL has 'edit' and an id in it, it's an edit request
		if (id) {
			this.action = "Edit"
			// get the campaign from the DB
			this.campaignGet.get(id)
				.subscribe(
					campaign => {
						this.campaign = campaign
						// enter the data from the campaign in the form
						this.hydrateForm()
						this.refresh.detectChanges()
						
					},
					e => console.log("error getting campaign snapshot: ", e),
					() => console.log("finished getting campaign snapshot")
				)
		}
	}
	
	createdForm: FormGroup
	campaign
	src: string = "http://via.placeholder.com/600x150"
	action: string = "Add"

	createForm () {
		this.createdForm = this.fb.group({
			name: this.fb.control("", [Validators.required, Validators.minLength(12), Validators.maxLength(36), Validators.pattern(/[a-zA-Z0-9 ]+/)]),
			type: this.fb.control("", [Validators.required]),
			goal: this.fb.control(null, [Validators.required, Validators.min(1)]),
			noDate: this.fb.control(false),
			end: this.fb.control(null, [Validators.required]),
			description: this.fb.control("", [Validators.pattern(/[a-zA-Z0-9 ]+/), Validators.minLength(36), Validators.maxLength(1024)]),
			affiliate_links: this.fb.array([]),
			thankYou: this.fb.control("", [Validators.minLength(5), Validators.maxLength(1024), Validators.pattern(/[a-zA-Z0-9 ]+/)]),
			fEmail: this.fb.control("", [Validators.pattern(/[\w|\d]+@[\w|\d]+\.\w+/i)]),
			eMessage: this.fb.control("", [Validators.pattern(/[a-zA-Z0-9 ]+/), Validators.maxLength(1024), Validators.minLength(12)]),
			shared: this.fb.control(false),
			privacy: this.fb.control(""),
			banner: this.fb.group({
				url: this.fb.control(""),
				path: this.fb.control("")
			}),
			active: this.fb.control(false),
			// id: this.fb.control(""),
			// _updated: this.fb.control(""),
			// account_id: this.fb.control(""),
			// begin: this.fb.control(""),
			// current: this.fb.control(""),
			// owner: this.fb.control(""),
			// payments: this.fb.group({})
		})
	}

	hydrateForm () {
		const { active, affiliate_links, banner, begin, description, eMessage, end, fEmail, goal, id, name, noDate, owner, privacy, shared, thankYou, type } = this.campaign
		
		if (affiliate_links.length < 3) {
			const pushme = 3 - affiliate_links.length
			for (let i = 0; i < pushme; i++) { affiliate_links.push("") }
		}
		
		this.src = this.campaign.banner.url
		// this.createdForm.setValue(this.campaign)
		this.createdForm.setValue({
			active,
			description,
			eMessage,
			end,
			fEmail,
			goal,
			name,
			noDate,
			privacy,
			shared,
			thankYou,
			type,
			affiliate_links,
			banner
		})
		
		// this.banner.setValue({ url: banner.url, path: banner.path })
		// this.affiliate_links.setValue()
		
	}
	
	createCampaign () {
		const campaign = this.prepareSaveCampaign()
		
		let f
		
		if (this.campaign.id) {
			const { id } = this.campaign
			Object.assign(campaign, { id })
			f = this.create.edit
		}
		else {
			f = this.create.create
		}
		
		f(campaign)
			.subscribe(
				() => {
					this.createdForm.reset()
					// should route to somewhere else
				},
				e => console.log("error creating campaign", e),
				() => console.log("completed creating campaign")
			)
	}
	
	saveBanner ({ url, fullPath }): void {
		this.banner.setValue({ url, path: fullPath })
		this.src = url
	}
	
	prepareSaveCampaign (): Campaign {
		return this.createdForm.value as Campaign
	}
	
	setAffiliate_links (): void {
		const affiliate_links = (this.campaign && this.campaign.affiliate_links) ? this.fb.array(this.campaign.affiliate_links) : this.fb.array([])
		this.createdForm.setControl('affiliate_links', affiliate_links)
	}

	activate (b: boolean): void {
		this.createdForm.setValue({ active: b })
		// should call this.createCampaign() from here and get rid of the submit on the form
	}

	
	addAffiliateLink (): void { this.affiliate_links.push(this.fb.control("")) }

	get affiliate_links (): FormArray { return this.createdForm.get('affiliate_links') as FormArray }
	get banner (): FormGroup { return this.createdForm.get("banner") as FormGroup }
	
	get name (): FormControl { return this.createdForm.get("name") as FormControl }
	get type (): FormControl { return this.createdForm.get("type") as FormControl }
	get goal (): FormControl { return this.createdForm.get("goal") as FormControl }
	get noDate (): FormControl { return this.createdForm.get("noDate") as FormControl }
	get end (): FormControl { return this.createdForm.get("end") as FormControl }
	get description (): FormControl { return this.createdForm.get("description") as FormControl }
	get thankYou (): FormControl { return this.createdForm.get("thankYou") as FormControl }
	get fEmail (): FormControl { return this.createdForm.get("fEmail") as FormControl }
	get eMessage (): FormControl { return this.createdForm.get("eMessage") as FormControl }
	get privacy (): FormControl { return this.createdForm.get("privacy") as FormControl }

	// get url (): FormControl { return this.banner.get("url") as FormControl }
	// get path (): FormControl { return this.banner.get("path") as FormControl }

}
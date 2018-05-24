import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

import { WepayService } from '../../services/wepay.service'

import { Campaign } from '../../objects/Campaign'

@Component({
  selector: 'app-payment-widget',
  templateUrl: './payment-widget.component.html',
  styleUrls: ['./payment-widget.component.scss']
})
export class PaymentWidgetComponent implements OnInit {
	@Input() campaign: Campaign

	email: string
	amount: number
	ppamount: number = 2
	name:string
	message:string
	private:boolean
	percent: number = 0
	percentStyle: {
		height: string
		width: string
		'background-color': string
		'border-radius': string
	}
	
	onDonate(form: NgForm) { const r = this.wepay.pay(form.value, this.campaign) }
	
	constructor(
		private wepay: WepayService
	) { }
	
	ngOnInit() {
		if (!this.campaign.current) this.campaign.current = 0
		this.percent = Math.floor(this.campaign.current/this.campaign.goal*100)
		this.percent = this.percent > 100 ? 100 : this.percent
		
		this.percentStyle = {
			height: "100%",
			width: `${this.percent}%`,
			'background-color': "green",
			'border-radius': "100px"
		}
	}

}

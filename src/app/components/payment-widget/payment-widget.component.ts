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
	
	onDonate(form: NgForm) { const r = this.wepay.pay(form.value, this.campaign) }
	
	constructor(
		private wepay: WepayService
	) { }
	
	ngOnInit() {
	}

}

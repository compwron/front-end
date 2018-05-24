import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { LoginService } from '../../../services/login.service'
import { WepayService } from '../../../services/wepay.service'

import { User } from '../../../objects/UserInterfaces'

@Component({
  selector: 'app-payment-deets',
  templateUrl: './payment-deets.component.html',
  styleUrls: ['./payment-deets.component.scss']
})

// "/account" endpoint has this on it:
const Balance = {
	"currency": string,
	"balance": number,
	"incoming_pending_amount": number,
	"outgoing_pending_amount": number,
	"reserved_amount": number,
	"disputed_amount": number,
	"withdrawal_period": string,
	"withdrawal_type": string,,
	"withdrawal_next_time": number,
	"withdrawal_bank_name": string
}

export class PaymentDeetsComponent implements OnInit {
	funds: number
	transfered: number
	user: User
	registering: boolean = false
	wepayLink = this.wepay.registerLink
	deactivateLink = this.wepay.deactivateLink
	
	constructor(
		private wepay: WepayService,
		private login: LoginService
	) {}
	
	setupWepay (): void {
		console.log("running wepay functions")
		this.registering = true
	}
	
	deactivateWepay (): void {
		console.log("deactivating wepay placeholder")
		this.registering = false
	}
	
	onSubmit(form: NgForm) {
		console.log(form.value)
	}
	
	ngOnInit() {
		this.user = this.login.pridepocketUser
		if (this.user.received) { this.funds = Object.values(this.user.received).reduce((t, d) => t += d.amount, 0) }
	}

}

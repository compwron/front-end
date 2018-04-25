import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { WepayService } from '../../../services/wepay.service'

@Component({
  selector: 'app-payment-deets',
  templateUrl: './payment-deets.component.html',
  styleUrls: ['./payment-deets.component.scss']
})
export class PaymentDeetsComponent implements OnInit {
	funds:string;
	transfer:string;

	// need to fix the loginService so that it has a copy of the user DB representation that I can access

	registering: boolean = false
	wepayLink = this.wepay.registerLink
	
	constructor(
		private wepay: WepayService
	) { }
	
	setupWepay (): void {
		console.log("running wepay functions")
		// this.wepay.watch(() => this.registering = false)
		this.registering = true
	}
	
	onSubmit(form: NgForm) {
		console.log(form.value)
	}
	
	ngOnInit() {
	}

}

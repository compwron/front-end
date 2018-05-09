import { Component, OnInit, Input } from '@angular/core'

import { WepayService } from '../../services/wepay.service'
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-wepay-payment-successful',
  templateUrl: './wepay-payment-successful.component.html',
  styleUrls: ['./wepay-payment-successful.component.scss']
})
export class WepayPaymentSuccessfulComponent implements OnInit {

	constructor(
		private wepay: WepayService,
		private route: ActivatedRoute
	) { }

	checkout_id: string

	ngOnInit() {
		const { checkout_id } = this.route.snapshot.queryParams
		this.checkout_id = checkout_id
		this.wepay.checkoutComplete(this.checkout_id, () => window.close())
	}
}
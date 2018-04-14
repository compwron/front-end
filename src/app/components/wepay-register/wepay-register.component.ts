import { Component, OnInit, Input } from '@angular/core'

import { WepayService } from '../../services/wepay.service'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wepay-register',
  templateUrl: './wepay-register.component.html',
  styleUrls: ['./wepay-register.component.scss']
})
export class WepayRegisterComponent implements OnInit {
	
	constructor(
		private wepay: WepayService
		private route: ActivatedRoute
	) { }
	
	ngOnInit() {
		const { code, user_id, access_token, token_type, expires_in } = this.route.snapshot.queryParamMap.params
		
		if (access_token) this.wepay.saveAccessToken({ user_id, access_token, token_type, expires_in })
		else this.wepay.getAccessToken(code)
	}

}

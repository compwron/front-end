import { Injectable } from '@angular/core';

import { LoginService } from '../login.service'

import { WEPAY as wepay } from 'wepay'

import { db, firebase } from '../utilities/utilities'

const wepay_settings = {
	'client_id'     : '110229',
	'client_secret' : '32fe4f7479',
	'access_token'  : 'PRODUCTION_daa92de3877f13535a83209c7598e2c25c746395ade6e9782e78ed92b14336f5'
}

const wp = new wepay(wepay_settings)
wp.use_staging()

@Injectable()
export class WepayService {
	
	constructor(
		private loginService: LoginService
	) { }

	promiseCall (url, data) {
		return new Promise((request, reject) => {
			wp.call(url, data, resolve)
		})
	}
	
	createAccount () {
		console.log(this.loginService.user)
		
		const data = {
			name: this.loginService.user.displayName,
			description: `wepay account for ${this.loginService.user.displayName}`,
			reference_id: this.loginService.user.uid,
			country: "US",
			currenices: ["USD"]
		}
		
		this.promiseCall('/account/create', JSON.stringify(data))
			.then(response => {
				this.loginService.user.wepay = response
				db.collection("users").doc(this.loginService.user.uid).set(this.loginService.user)
					.then(r => console.log("set wepay credentails for account", this.loginService.user.displayName, r))
					.catch(e => console.log("failed to set wepay credentials for account", this.loginService.user.displayName, e))
			})
		// wp.call('/account/create', JSON.stringify(data))

	}
	
	pay ({ campaignId, amount, shortDescription, }) {
		const data = {
			
		}
		
		this.promiseCall(url, data)
			.then()
		// wp.call('', data)
	}

}

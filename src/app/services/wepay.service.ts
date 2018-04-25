import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http'
import { HttpEvent } from '@angular/common/http'


import { Observable } from 'rxjs/Observable'
import { Router } from '@angular/router'
import { LoginService } from './login.service'
import { HttpParams } from '@angular/common/http'
// import { WEPAY as wepay } from 'wepay'
import { db, firebase } from '../utilities/utilities'

// const wp = new wepay(wepay_settings)
// wp.use_staging()

const client_id = 53075
const client_secret = '3abef328ac'

class WepayPayment {
	checkout_id: string
	checkout_uri: string
}

/*
"client_id": "53075", "client_secret": "3abef328ac", "code": "9ddb956d67c61b241077224a8bc91b841ddeb66294f1460709", "redirect_uri": "http://localhost:4200/redirect"

*/

// interface AccessToken {
// 	user_id: string
// 	access_token: string
// 	token_type: string
// }

@Injectable()
export class WepayService {
	constructor(
		private http: HttpClient,
		private loginService: LoginService,
		private router: Router
	) { }

	redirect: string = "http://localhost:4200/redirect"
	// redirect: string = "https://pridepocket-3473b.firebaseapp.com/redirect"

	registerLink: string = `https://stage.wepay.com/v2/oauth2/authorize?client_id=53075&redirect_uri=${this.redirect}&scope=manage_accounts,collect_payments,view_user,preapprove_payments,send_money`
	tokenLink: string = "https://stage.wepayapi.com/v2/oauth2/token"

	checkoutUri: string
	registered: boolean
	previous: string = "/"

	options = {
		headers: new HttpHeaders({
			"Content-Type": "application/json"
		})
	}

	// watch (callback): void {
	// 	// set a listener on the user's db representation
	// 	let unsubscribe = db.collection("users").doc(this.loginService.user.uid).onSnapshot(doc => {
	// 		unsubscribe()
	// 		let { wepay, uid, displayName } = this.loginService.user
	// 		this.register({ displayName, uid, access_token: wepay.access_token })
	// 		callback()
	// 	})
	// }


	getAccessToken (code): void {
		let url = "https://us-central1-pridepocket-3473b.cloudfunctions.net/wepay/get_token"
		
		this.http.post(url, { code, redirect_uri: this.redirect }, this.options)
			.subscribe(
				r => {
					this.saveAccessToken(r)
					console.log(r)
				},
				e => console.log("error getting access token", e),
				() => console.log("completed: ")
			)
	}

	// '{"client_id": "53075", "client_secret": "3abef328ac", "code": "cbdfa48abd5ccd403b4a7078e893704b663ff4170c549d4907", "redirect_uri": "http://localhost:4200/redirect"}'

	saveAccessToken(wepay) {
		let user = Object.assign({}, this.loginService.pridepocketUser)
		user.wepay = wepay
		
		console.log(this.loginService.getUser())
		console.log(this.loginService.pridepocketUser)
		
		db.collection("users").doc(this.loginService.getUser().uid).set(user, { merge: true })
			.then(r => {
				window.close()
				this.router.navigateByUrl(this.previous)
			})
	}


	register ({ displayName, uid, access_token }): void {
		// hit the register endpoint with the right credentials

		let responseObservable = this.http.post("https://us-central1-pridepocket-3473b.cloudfunctions.net/register", { displayName, uid, access_token }, this.options)
			// .pipe(catchError())
			.subscribe(
				response => {
					// let { account_id, name, description, owner_user_id } = response
					db.collection("users").doc(uid).set({ wepay: response }, { merge: true }) // { account_id, name, description, owner_user_id }
				},
				e => { console.log("error posting to register endpoint: ", e) }
			)

	}

	pay (payment, campaignDetails): void {
		payment = Object.assign({}, payment, { type: "donation", currency: "USD" })
		
		// call 'pay' endpoint with payment object, which returns an object that includes a checkout link
		// let response = {} // pay
		let responseObservable = this.http.post("https://us-central1-pridepocket-3473b.cloudfunctions.net/pay", payment, { headers: new HttpHeaders({ "content-type": "application/json" }) })
			.subscribe((response: WepayPayment) => {
					// let { checkout_id, short_description, currency, amount, checkout_uri } = response
			
					let batch = db.batch()
					
					let campaign = db.collection("campaigns").doc(campaignDetails.id)
					let donator = db.collection("users").doc(this.loginService.pridepocketUser.uid)
					let host = db.collection("users").doc(campaignDetails.owner)
					
					batch.set(donator, { domations: { [response.checkout_id]: response } }, { merge: true })
					batch.set(campaign, { payments: { [response.checkout_id]: response } }, { merge: true })
					batch.set(host, { [campaignDetails.id]: response }, { merge: true }) // { checkout_id, short_description, currency, amount }
			
					batch.commit()
						.then(() => {
							// I also need to set the new campaign total figure
								// this will be an observer that gets fed a stream of price updates/totals?
							this.checkoutUri = response.checkout_uri
						})
				},
				e => { console.log("error getting response from pay endpoint", e) }
			)
	}
}

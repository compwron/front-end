import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http'
import { HttpEvent } from '@angular/common/http'

import { Observable } from 'rxjs/Observable'
import { Router } from '@angular/router'
import { LoginService } from './login.service'
import { HttpParams } from '@angular/common/http'

import { db, firebase } from '../utilities/utilities'

const client_id = 53075
const client_secret = '3abef328ac'

class WepayPayment {
	checkout_id: string
	checkout_uri: string
}


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

	watch (): void {
		// set a listener on the user's db representation
		let unsubscribe = db.collection("users").doc(this.loginService.getUser().uid).onSnapshot(doc => {
			if (doc.data().wepay.access_token) {
				unsubscribe()

				let { uid, displayName } = this.loginService.getUser()
				displayName = displayName ? displayName : "anonymous"
				db.collection("user").doc(uid).get()
					.then(user => {
						let { access_token } = doc.data().wepay
						this.register({ displayName, uid, access_token })
					})
			}
		})
	}

	getAccessToken (code): void {
		let url = "https://us-central1-pridepocket-3473b.cloudfunctions.net/wepay/get_token"
		
		this.http.post(url, { code, redirect_uri: this.redirect }, this.options)
			.subscribe(
				r => this.saveAccessToken(r),
				e => console.log("error getting access token", e),
				() => console.log("access_token request completed")
			)
	}

	saveAccessToken(wepay) {
		let { uid, displayName } = this.loginService.getUser()
	
		db.collection("users").doc(uid).get()
			.then(r => {
				let user = r.data()
				user.wepay = wepay

				db.collection("users").doc(uid).set(user, { merge: true })
					.then(r => {
						this.watch()
						// this.router.navigateByUrl(this.previous)
					})
			})
	}

	register (data): void {
		let responseObservable = this.http.post("https://us-central1-pridepocket-3473b.cloudfunctions.net/wepay/register", data, this.options)
			.subscribe(
				response => {
					db.collection("users").doc(data.uid).set({ wepay_merchant: response })
						.then(() => window.close())
						.catch(e => console.log("error registering user as a merchant on wepay: ", e))
				},
				e => { console.log("error posting to register endpoint: ", e) }
			)

	}

	pay (payment, campaignDetails): void {
		payment = Object.assign({}, payment, { type: "donation", currency: "USD" })
		
		// call 'pay' endpoint with payment object, which returns an object that includes a checkout link
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
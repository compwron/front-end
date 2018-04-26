import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http'
import { HttpEvent } from '@angular/common/http'

import { Observable } from 'rxjs/Observable'
import { Router } from '@angular/router'
import { LoginService } from './login.service'
import { HttpParams } from '@angular/common/http'

import { db, firebase } from '../utilities/utilities'
import { AccessToken, WePayMerchant, WePayRegistration, WePayPayment } from '../objects/WePayInterfaces'

const client_id = 53075
const client_secret = '3abef328ac'

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

	// sends the auth code to the server which gets an access_token from wepay
	getAccessToken (code: string): void {
		let url = "https://us-central1-pridepocket-3473b.cloudfunctions.net/wepay/get_token"
		
		this.http.post<AccessToken>(url, { code, redirect_uri: this.redirect }, this.options)
			.subscribe(
				(r: AccessToken) => this.saveAccessToken(r),
				e => console.log("error getting access token", e),
				() => console.log("access_token request completed")
			)
	}

	saveAccessToken(wepay: AccessToken): void {
		let { uid, displayName } = this.loginService.getUser()
	
		console.log("this.loginService.getPPUser()", this.loginService.getPPUser())
	
		db.collection("users").doc(uid).get()
			.then((r: firebase.firestore.DocumentSnapshot) => {
				let user = r.data()
				user.wepay = wepay

				db.collection("users").doc(uid).set(user, { merge: true })
					.then((): void => {
						let { uid, displayName } = user
						displayName = displayName ? displayName : "anonymous"
						let { access_token } = user.wepay

						this.register({ displayName, uid, access_token })
						// this.watch()
					})
			})
	}

	register (data: WePayRegistration): void {
		let responseObservable = this.http.post<WePayMerchant>("https://us-central1-pridepocket-3473b.cloudfunctions.net/wepay/register", data, this.options)
			.subscribe(
				(response: WePayMerchant) => {
					if (!!response.error) {
						console.log("error registering this user on WePay: ", response.error)
						if (response.error_code === 1003) console.log("there is already someone on our system who registered this email with WePay")
					}
					else {
						db.collection("users").doc(data.uid).set({ wepay_merchant: response }, { merge: true })
							.then(() => {
								this.registered = true
								window.close()
							})
							.catch(e => console.log("error registering user as a merchant on wepay: ", e))
					}
				},
				e => { console.log("error posting to register endpoint: ", e) }
			)

	}

	pay (payment, campaignDetails): void {
		console.log("this.loginService.pridepocketUser", this.loginService.pridepocketUser)
		
		db.collection("users").doc(this.loginService.getUser().uid).get()
			.then((r: firebase.firestore.DocumentSnapshot) => {
				payment = Object.assign({}, payment, campaignDetails, { access_token: r.data().wepay.access_token })

				// call 'pay' endpoint with payment object, which returns an object that includes a checkout link
				let responseObservable = this.http.post("https://us-central1-pridepocket-3473b.cloudfunctions.net/pay", payment, this.options)
					.subscribe((response: WePayPayment) => {
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
			})
	}
}



	// set a listener on the user's db representation, which should fire when the user gets a new access_token
	//	this function is currently redundant and can be eliminated
	// watch (): void {
	// 	let unsubscribe = db.collection("users").doc(this.loginService.getUser().uid).onSnapshot(doc => {
	// 		if (doc.data().wepay.access_token) {
	// 			unsubscribe()

	// 			let { uid, displayName } = this.loginService.getUser()
	// 			displayName = displayName ? displayName : "anonymous"
	// 			let { access_token } = doc.data().wepay

	// 			this.register({ displayName, uid, access_token })
				
	// 			// this is currently a redundant database call; I have uid, display name, and access_token from the subscribe doc
	// 			// db.collection("user").doc(uid).get()
	// 			// 	.then((user: firebase.firestore.DocumentSnapshot) => {
	// 			// 		let { access_token } = doc.data().wepay
	// 			// 		this.register({ displayName, uid, access_token })
	// 			// 	})
	// 		}
	// 	})
	// }
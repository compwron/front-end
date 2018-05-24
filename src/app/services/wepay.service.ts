import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http'
import { HttpEvent } from '@angular/common/http'

import { Observable } from 'rxjs/Observable'
import { Router } from '@angular/router'
import { LoginService } from './login.service'
import { HttpParams } from '@angular/common/http'

import { pipe } from 'rxjs/util/pipe'

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
	) {
		// should I try the same initialize function that I use in the nav's ngInit function?)
	}

	redirect: string = window.location.origin + "/redirect"
	// redirect: string = "https://pridepocket-3473b.firebaseapp.com/redirect"

	deactivateLink: string = '#'
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
		let { uid, displayName } = this.loginService.pridepocketUser
	
		// console.log("this.loginService.getPPUser()", this.loginService.pridepocketUser)
	
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
		this.http.post<WePayMerchant>("https://us-central1-pridepocket-3473b.cloudfunctions.net/wepay/register", data, this.options)
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

	checkoutComplete (checkout_id: string, callback): void {
		this.http.post("https://us-central1-pridepocket-3473b.cloudfunctions.net/wepay/checkout_status", { checkout_id }, this.options)
			.subscribe(
				pipe(
					(r: WePayPayment) => this.saveCompletedTransaction(r, this.loginService),
					(r) => r.then(s => callback(s) )
				),
				e => console.log("error getting checkout information from WePay", e),
				() => console.log("successfully completed getting checkout information from WePay")
			)
	}

	saveCompletedTransaction (response: WePayPayment, loginService): Promise<string | void> {
		if (!!response.error_code) {
			console.log("error getting checkout information after successful payment", response.error_code)
		}
		else {
			return db.collection("pending").doc(response.checkout_id.toString()).get()
				.then((snapshot: firebase.firestore.DocumentSnapshot) => {
					const campaignDetails = snapshot.data()
					
					let batch = db.batch()

					// console.log(campaignDetails)
					// console.log(loginService)

					let campaign = db.collection("campaigns").doc(campaignDetails.id)
					let donator = db.collection("users").doc(loginService.pridepocketUser.uid)
					let host = db.collection("users").doc(campaignDetails.owner)

					campaignDetails.current = Object.values(campaignDetails.payments || {}).reduce((c, payment) => payment.amount + c, 0) + response.amount

					batch.set(donator, { donations: { [response.checkout_id]: response } }, { merge: true })
					batch.set(campaign, { current: campaignDetails.current, payments: { [response.checkout_id]: response } }, { merge: true })
					batch.set(host, { received: { [campaignDetails.id]: response } }, { merge: true })

					return batch.commit()
						.then(() => {
							return db.collection("pending").doc(response.checkout_id.toString()).delete()
								.then(r => {
									console.log(`deleted transaction ${response.checkout_id.toString()} from pending collection because it completed successfully`)
									return "success"
								})
								.catch(e => console.log(`error deleting transaction ${response.checkout_id.toString()} from pending: `, e))
						})
						.catch(e => console.log("batch commit failed: ", e))
				})
				.catch(e => console.log(`cannot get pending transaction with this id: ${response.checkout_id.toString()}`, e))
		}
	}

	pay (payment, campaignDetails): void {
		payment = Object.assign({}, payment, { campaignDetails }) // , { access_token: this.loginService.pridepocketUser.wepay.access_token }

		// call 'pay' endpoint with payment object, which returns an object that includes a checkout link
		this.http.post("https://us-central1-pridepocket-3473b.cloudfunctions.net/wepay/pay", payment, this.options)
			.subscribe(
				(response: WePayPayment) => {
					console.log(response)
					if (!response.error_code) {
						return db.collection("pending").doc(response.checkout_id.toString()).set(campaignDetails)
							.then(() => {
								window.open(response.hosted_checkout.checkout_uri, '_blank')
								return response.hosted_checkout.checkout_uri
							})
					}
					else console.log("error making donation: ", response.error)
				},
				e => console.log("error getting response from pay endpoint", e),
				() => console.log("pay functions in wepay.service complete")
			)
	}
}


						// let batch = db.batch()
						
						// let campaign = db.collection("campaigns").doc(campaignDetails.id)
						// let donator = db.collection("users").doc(this.loginService.pridepocketUser.uid)
						// let host = db.collection("users").doc(campaignDetails.owner)

						// // this isn't really the place to be accumulating; it should happen on the server function that fires when WePay handles a checkout
						
						// 	// campaignDetails.current = Object.values(campaignDetails.payments).reduce((c, payment) => {
						// 	// 	console.log("c", c)
						// 	// 	console.log("payment.amount", payment.amount)
						// 	// 	return payment.amount + c
						// 	// }, 0) + response.amount
		
						// 	// console.log(campaignDetails.current)
	
						// batch.set(donator, { donations: { [response.checkout_id]: response } }, { merge: true })
						// batch.set(campaign, { current: campaignDetails.current, payments: { [response.checkout_id]: response } }, { merge: true })
						// batch.set(host, { received: { [campaignDetails.id]: response } }, { merge: true })
	
						// batch.commit()
						// 	.then(() => {
						// 		// I also need to set the new campaign total figure
						// 			// this will be an observer that gets fed a stream of price updates/totals?
						// 		this.checkoutUri = response.checkout_uri
						// 	})



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
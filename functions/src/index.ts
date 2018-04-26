import * as functions from 'firebase-functions';
const admin = require("firebase-admin")

import { WEPAY as wepay } from 'wepay'

const express = require('express');
const cors = require('cors');

// const querystring = require('querystring')

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));



admin.initializeApp()
// import { db, firebase } from '../utilities/utilities'

const wepay_settings = {
	'client_id'     : '53075',
	'client_secret' : '3abef328ac',
	// 'access_token'  : 'PRODUCTION_daa92de3877f13535a83209c7598e2c25c746395ade6e9782e78ed92b14336f5'
	'access_token'  : 'STAGE_28467f7ddf1ef46e545bed9a9cb18d3103fa4e46d8a278ff461f12150093c957'
}

const wp = new wepay(wepay_settings)

// https://developer.wepay.com/docs/articles/testing
wp.use_staging()
// wp.use_production()

// export const redirect = functions.https.onRequest((req, res) => {
// 	const { code, state } = req.body
// 	console.log(code, state)
// })

const promiseCall = (url, data) => {
	const p = new Promise((resolve, reject) => wp.call(url, data, resolve))
	return p
}


// payment = Object.assign({}, payment, campaignDetails, { access_token: r.wepay.access_token })
app.post('/pay', (req, res) => {
	const { amount, ppamount, access_token } = req.body
	const { account_id } = req.body.campaignDetails
	
	// switch wp.setAccessToken to user-provided access token
	const app_access_token = wp.get_access_token()
	wp.set_access_token(access_token)
	
	// // THIS IS FOR TESTING ONLY
	// if (!account_id) {
	// 	account_id = "1397632302"
	// 	amount = "50"
	// 	fee = "5"
	// }
	
	console.log(account_id, amount, ppamount)
	
	const data = {
		account_id,
		amount,
		"type": "donation",
		"currency": "USD",
		"short_description": "test payment",
		"long_description": "This is a test payment",
		"email_message": {
		    "to_payer": "Please contact us at 555-555-555 if you need assistance.",
		},
		"delivery_type": "donation",
		"fee": {
		    "app_fee": ppamount,
		    "fee_payer": "payer"
		},
		"auto_release": true //,
	}

	return promiseCall('/checkout/create', data)
		.then(r => {
			wp.set_access_token(app_access_token)
			res.send(r)
		})

	// when a user hits this link, it should create a transaction on their account representation (?)
	// I want to return the link that the user clicks to complete the transaction
	// the user completes the transaction on the wepay site, and gets a generic success page there,
	// then comes back to pridepocket; maybe their profile page which shows a list of their latest donations
		
})

app.post('/get_token', (req, res) => {
	const { code, redirect_uri } = req.body
	
	console.log("in access_token function", code, redirect_uri)
	
	const data = {
		client_id: wepay_settings.client_id,
		client_secret: wepay_settings.client_secret,
		code,
		redirect_uri
	}
	
	return promiseCall('/oauth2/token', data)
		.then(r => {
			console.log(r)
			res.json(r)
		})
		.then(e => console.log("error while calling oauth2/token route: ", e))
})

app.post('/register', (req, res) => {
// export const register = functions.https.onRequest((req, res) => {
	const { displayName, uid, access_token } = req.body
	
	// console.log(access_token)
	
	const app_access_token = wp.get_access_token()
	wp.set_access_token(access_token)
	
	// console.log(wp.get_access_token)
	
	const data = {
	  "name": displayName,
	  "description": "pridepocket donation account",
	  "reference_id": uid,
	  "country": "US",
	  "currencies": [
	    "USD"
	  ]
	}

	return promiseCall('/account/create', data)
		.then(r => {
			wp.set_access_token(app_access_token)
			return res.send(r)
		})
		.catch(e => console.log("something went wrong calling account/create", e))
})


exports.wepay = functions.https.onRequest(app)


// app.post('/redirect', (req, res) => {
// // export const redirect = functions.https.onRequest((req, res) => {
// 	const { access_token, code, user_id } = req.body
// 	console.log(access_token, code, user_id)
	
	
// })

// app.get('/get_code', (req, res) => {
// 	// I need to get the userId off this call and save the state to the DB
// 	//	so that I can find the user again when the access_token returns
// 	const { state, user } = req.body
	
// 	const params = {
// 		client_id: wepay_settings.client_id,
// 		redirect_uri: "https://us-central1-pridepocket-3473b.cloudfunctions.net/wepay/get_token",
// 		scope: "scope=manage_accounts,collect_payments,view_user,preapprove_payments,send_money",
// 		state
// 	}
	
// 	return promiseCall('/oauth2/authorize', params)
// 		.then(r => res.send(r))
// })


// create returns the following relevant information:
/*
{
  "account_id": 3015357,
  "name": "Example Account",
  "state": "action_required",
  "description": "This is just an example WePay account.",
  "owner_user_id": 254815262
}
*/
// it will get saved to the wepay field of the user's database representation and then get used to create/modify campaigns




			// console.log("response to wepay API call: ", r)
			// return r
			// this.loginService.user.wepay = response
			// db.collection("users").doc(this.loginService.user.uid).set(this.loginService.user)
			// 	.then(r => console.log("set wepay credentails for account", this.loginService.user.displayName, r))
			// 	.catch(e => console.log("failed to set wepay credentials for account", this.loginService.user.displayName, e))



// THIS IS THE CODE FOR HANDLING CAMPAIGN CREATION

// https://stage.wepay.com/v2/oauth2/authorize?client_id=53075&redirect_uri=https://us-central1-pridepocket-3473b.cloudfunctions.net/authorize&scope=manage_accounts,collect_payments,view_user,preapprove_payments,send_money
// &user_name=&user_email=&user_country=

// export const authorize = functions.https.onRequest((req, res) => {
// 	// this function is the callback for the authorize call; it sends the code that you return to the /oauth2/token route
// 	let { code, user_id, access_token, token_type, expires_in } = req.body
	
// 	if (code) {
// 		// send to the /oauth2/token endpoint
// 		res.redirect()
// 	}
// 	else {
// 		// put the access_token in the DB for the user
// 		db.collection("users").doc(user_id).set({ wepay: { user_id, access_token, token_type, expires_in } }, { merge: true })
// 		res.end()
// 	}
// })

/*
export const token = functions.https.onRequest((req, res) => {
	// this gets the access_token back from the wepay server and stores it in the database on the user representation
	
	// token comes back as:
	

		// user_id,
		// access_token,
		// token_type,
		// expires_in

	
	// I don't know what the user_id is or where it comes from; but it's going to need to match with something I've saved already
	
})

*/

// finish the checkout process on the client side after creating a transaction...
// https://developer.wepay.com/docs/process-payments/embedded-checkout



/*
response to checkout/create:
{
	"checkout_id":142658433,
	"account_id":1397632302,
	"type":"donation",
	"short_description":"test payment",
	"currency":"USD",
	"amount":10,
	"state":"new",
	"soft_descriptor":"WPY*DURRRRR",
	"create_time":1523640684,
	"gross":0,
	"reference_id":null,
	"callback_uri":null,
	"long_description":null,
	"delivery_type":null,
	"fee":
		{
			"app_fee":0,
			"processing_fee":0,
			"fee_payer":"payer"
		},
	"chargeback":
		{
			"amount_charged_back":0,
			"dispute_uri":null
		},
	"refund":
		{
			"amount_refunded":0,
			"refund_reason":null
		},
	"hosted_checkout":
		{
			"checkout_uri":"https:\/\/stage.wepay.com\/api\/checkout\/142658433\/6b030543",
			"redirect_uri":null,
			"shipping_fee":0,
			"require_shipping":false,
			"shipping_address":null,
			"theme_object":null,
			"mode":"regular",
			"auto_capture":true
		},
	"payment_method":null,
	"payer":
		{
			"name":null,
			"email":null,
			"home_address":null
		},
	"npo_information":null,
	"payment_error":null,
	"in_review":false,
	"auto_release":true
}
*/
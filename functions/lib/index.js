"use strict";
/*

FUNCTIONS DOCS:

Delivery of function invocations is not currently guaranteed.
As the Cloud Firestore and Cloud Functions integration improves,
we plan to guarantee "at least once" delivery.
However, this may not always be the case during beta.
This may also result in multiple invocations for a single event,
so for the highest quality functions ensure that the functions are written to be idempotent.

*/
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const wepay_1 = require("wepay");
const express = require('express');
const cors = require('cors');
// const querystring = require('querystring')
const app = express();
const { email, donationReceived, draftCampaignCreated, goalExceeded, campExpired } = require('./email');
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
admin.initializeApp();
const db = admin.firestore();
const wepay_settings = {
    'client_id': '53075',
    'client_secret': '3abef328ac',
    // 'access_token'  : 'PRODUCTION_daa92de3877f13535a83209c7598e2c25c746395ade6e9782e78ed92b14336f5'
    // 'access_token'  : 'STAGE_28467f7ddf1ef46e545bed9a9cb18d3103fa4e46d8a278ff461f12150093c957'
    'access_token': 'STAGE_d6abe7dd7ef8f2e32efa27462f81a0ec31c22d2d68b5ac1ac41e5770c4cc82bf'
};
const wp = new wepay_1.WEPAY(wepay_settings);
// https://developer.wepay.com/docs/articles/testing
wp.use_staging();
// wp.use_production()
// export const redirect = functions.https.onRequest((req, res) => {
// 	const { code, state } = req.body
// 	console.log(code, state)
// })
const promiseCall = (url, data) => {
    // console.log(wp.get_access_token())
    // console.log(wepay_settings.access_token)
    const p = new Promise((resolve, reject) => wp.call(url, data, resolve));
    return p;
};
exports.campaignCreated = functions.firestore.document('campaigns/{campaignId}').onCreate((snap, context) => {
    const campaign = snap.data();
    if (campaign.active)
        return;
    else
        return draftCampaignCreated(campaign);
});
exports.campaignChanged = functions.firestore.document('campaigns/{campaignId}').onUpdate((change, context) => {
    const campaign = change.after.data();
    if (campaign.current > campaign.goal)
        goalExceeded(campaign);
});
exports.donationReceived = functions.firestore.document('campaigns/{campaignId}/payments/{paymentId}').onUpdate((change, context) => {
    const { campaign } = change.after.data();
    const { paymentId } = context.params;
    const payment = campaign.payments[paymentId];
    delete campaign.payments;
    const changeInfo = Object.assign({}, campaign, { payment });
    return donationReceived(changeInfo);
});
exports.email = functions.firestore.document('campaigns/{campaignId}').onCreate((snap, context) => {
    console.log("running email function");
    const demo_data = [
        "contribution",
        "cjohnson6382@gmail.com",
        "testing email templates",
        {
            "host": "Rachel Blank",
            "id": "xyz",
            "name": "Wedding",
            "security": "link",
            "raised": "$100",
            "goal": "100",
            "donator": "Jamie",
            "donation": "$20"
        }
    ];
    return email(...demo_data);
});
// https://github.com/firebase/functions-cron
exports.deactivateExpired = functions.pubsub.topic('deactivate-expired').onPublish((event) => {
    // console.log("Deactivate all expired campaigns")
    // return true
    const ddd = new Date();
    return db.collection("campaigns").where("end", "<", ddd).get()
        .then(expired => {
        // console.log("there are this many expired campaigns:", expired.size)
        // console.log(expired.docs.map(d => d.data().name))
        // return true
        const pArray = [];
        const size = expired.size;
        const docs = expired.docs;
        let expiredCampaigns = [];
        for (let i = 0; i < size; i += 400) {
            const docSet = docs.slice(i, i + 400);
            const b = db.batch();
            expiredCampaigns.push(docSet.map(ex => {
                b.set(ex.ref, { done: true }, { merge: true });
                return ex;
            }));
            // docSet.forEach(ex => b.set(ex.ref, { done: true }, { merge: true}) )
            // expiredCampaigns = expiredCampaigns.concat(docSet)
            pArray.push(b.commit());
        }
        console.log("resolving batches");
        return Promise.all(pArray)
            .then((pa) => {
            // for each successful set operation, send out the 'campaign ended' email
            // this may not be in the correct order
            pa.forEach((rSet, i) => {
                if (rSet.every(p => p === false))
                    expiredCampaigns[i]
                        .forEach(c => campExpired(c));
            });
            if (pa.every(p => p === false))
                return true;
            else
                return false;
        });
        // return b.commit().then(() => true)
    });
});
/*
const notification_callback_url = "https://pridepocket-3473b.firebaseapp.com/wepay_notification_callback"

interface WithdrawalNotification = {
    "notification_id": string,
    "type": string,
    "app_id": number,
    "account_id": number,
    "user_id": number,
    "user_email": string,
    "topic": string,
    "event_time": number,
    "sequence_number": number,
    "payload": Payload
}

interface Payload = {
    "account_id": number,
    "withdrawal_date": number,
    "deny_reason_code": string,
    "withdrawal_create_date": number,
    "withdrawal_id": number,
    "deny_reason_message": string
}


// https://pridepocket-3473b.firebaseapp.com/wepay_notifications_subscribe?topic=TOPIC_NAME
app.get('/wepay_notifications_subscribe', (req, res) => {
    // /notification_preference/create
    return promiseCall('/notification_preference/create', { type: "ipn", topic: req.params.topic, callback_url: notification_callback_url }).then(r => res.json({ status: "success", message: JSON.stringify(r) }))
})

// https://pridepocket-3473b.firebaseapp.com/wepay_notifications_callback body: { notification } ???
//	might also just be the notification ID that you have to use to fetch the notification
app.post('/wepay_notification_callback', (req, res) => {
    console.log(req.body)
    
    const { notification } = req.body
    
    console.log("notification: ", notification)
    
    const doc
    
    return db.collection("users").where("wepay_merchant.account_id", "==", notification.account_id).get()
        .then(docSnapshot => {
            
            console.log("docSnapshot: ", docSnapshot.empty)
            
            doc = docSnapshot.size === 1 ? docSnapshot.docs[0] : res.json({ status: "error", message: "query for this account_id returned more than one response???" })
            
            console.log("doc", doc.id)
            
            return doc.set({ notifications: { [notification.notification_id]: notification } }, { merge: true })
                .then(() => res.end("success"))
                .catch(e) => {
                    console.log(`couldn't add notification to doc ${doc.id}: `, notification)
                    res.end("failure")
                }
        }
    
    // docSnapshot.forEach(d => doc = d)
    
    
    // switch (notification.topic) {
    // 	case "payment_bank":
    // 	case "adjustment":
    // 	case "payment":
    // 	case "withdrawal":
    // 	case "account":
    // 	case "settlement_path":
    // 	case "dispute":
    // 	default:
    // }
})

*/
app.post('/checkout_status', (req, res) => {
    const { checkout_id, access_token } = req.body;
    const app_access_token = wp.get_access_token();
    wp.set_access_token(access_token);
    console.log("checkout_status route");
    console.log(checkout_id, access_token);
    return promiseCall('/checkout', { checkout_id }).then(r => {
        console.log("wepay /checkout returned: ", r);
        wp.set_access_token(app_access_token);
        res.send(r);
    });
});
// payment = Object.assign({}, payment, campaignDetails, { access_token: r.wepay.access_token })
app.post('/pay', (req, res) => {
    const { amount, ppamount, access_token } = req.body;
    const { account_id } = req.body.campaignDetails;
    // switch wp.setAccessToken to user-provided access token
    const app_access_token = wp.get_access_token();
    wp.set_access_token(access_token);
    console.log(account_id, amount, ppamount);
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
        "auto_release": true,
        "hosted_checkout": {
            "redirect_uri": "https://pridepocket-3473b.firebaseapp.com/payment_successful"
            // "redirect_uri": "http://localhost:4200/payment_successful"
        }
    };
    return promiseCall('/checkout/create', data)
        .then(r => {
        console.log("wepay create payment call returned: ", r);
        wp.set_access_token(app_access_token);
        res.json(r);
    });
    // when a user hits this link, it should create a transaction on their account representation (?)
    // I want to return the link that the user clicks to complete the transaction
    // the user completes the transaction on the wepay site, and gets a generic success page there,
    // then comes back to pridepocket; maybe their profile page which shows a list of their latest donations
});
app.post('/get_token', (req, res) => {
    const { code, redirect_uri } = req.body;
    // console.log("in access_token function", code, redirect_uri)
    const data = {
        client_id: wepay_settings.client_id,
        client_secret: wepay_settings.client_secret,
        code,
        redirect_uri
    };
    return promiseCall('/oauth2/token', data)
        .then(r => {
        console.log(r);
        res.json(r);
    })
        .then(e => console.log("error while calling oauth2/token route: ", e));
});
app.post('/register', (req, res) => {
    // export const register = functions.https.onRequest((req, res) => {
    const { displayName, uid, access_token } = req.body;
    // console.log(access_token)
    const app_access_token = wp.get_access_token();
    wp.set_access_token(access_token);
    // console.log(wp.get_access_token)
    const data = {
        "name": displayName,
        "description": "pridepocket donation account",
        "reference_id": uid,
        "country": "US",
        "currencies": [
            "USD"
        ]
    };
    return promiseCall('/account/create', data)
        .then(r => {
        wp.set_access_token(app_access_token);
        return res.send(r);
    })
        .catch(e => console.log("something went wrong calling account/create", e));
});
exports.wepay = functions.https.onRequest(app);
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
//# sourceMappingURL=index.js.map
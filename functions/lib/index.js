"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const wepay_1 = require("wepay");
const https = require('https');
const querystring = require('querystring');
const request = require('request-promise');
// import fetch from 'node-fetch'
admin.initializeApp();
// import { db, firebase } from '../utilities/utilities'
const wepay_settings = {
    'client_id': '53075',
    'client_secret': '3abef328ac',
    // 'access_token'  : 'PRODUCTION_daa92de3877f13535a83209c7598e2c25c746395ade6e9782e78ed92b14336f5'
    'access_token': 'STAGE_28467f7ddf1ef46e545bed9a9cb18d3103fa4e46d8a278ff461f12150093c957'
};
const wp = new wepay_1.WEPAY(wepay_settings);
wp.use_staging();
exports.redirect = functions.https.onRequest((req, res) => {
    const { code, state } = req.body;
    console.log(code, state);
});
exports.pay = functions.https.onRequest((request, response) => {
    const { account_id, amount, fee } = request.body;
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
            "app_fee": fee,
            "fee_payer": "payer"
        },
        // I don't know if I need this; see what's on the response first
        "callback_uri": "http://www.example.com",
        "auto_release": true //,
        // "hosted_checkout": {
        //     "redirect_uri": "http://www.example.com",
        //     "fallback_uri": "http://www.example.com",
        //     "shipping_fee": 2,
        //     "mode": "iframe",
        //     "require_shipping": true,
        //     "prefill_info": {
        //         "address": "main street",
        //         "zip": "94085",
        //         "country": "US"
        //      },
        //      "theme_object": {
        //          "name": "test",
        //          "primary_color": "ffffff",
        //          "background_color": "ffffff",
        //          "button_color": "000000",
        //          "secondary_color": "000000"
        //      },
        //     "funding_sources": ["credit_card"]
        //  }
    };
    promiseCall('/checkout/create', JSON.stringify(data))
        .then(r => {
        // insert transaction in the database
        console.log(r);
        response.end(r);
    })
        .catch(e => console.log("something went wrong calling checkout/create", e));
});
// form = {"displayName":"donkey","uid":"12345678"}
/*

{ account_id: 1011964793 }

*/
// curl -H 'content-type: application/json' -H 'authorization: bearer STAGE_28467f7ddf1ef46e545bed9a9cb18d3103fa4e46d8a278ff461f12150093c957' https://stage.wepayapi.com/v2/account/find
const promiseCall = (url, data) => {
    const p = new Promise((resolve, reject) => wp.call(url, data, resolve));
    // return p.then(r => console.log(r))
    return p;
};
exports.register = functions.https.onRequest((req, res) => {
    // const { displayName, uid } = req.body
    const data = {
        "name": "DURRRRR Account",
        "description": "This is just an example WePay account.",
        "reference_id": "GHI456",
        "country": "US",
        "currencies": [
            "USD"
        ]
    };
    return promiseCall('/account/create', data)
        .then(r => {
        return res.send(r);
        console.log("response to wepay API call: ", r);
        // return r
        // this.loginService.user.wepay = response
        // db.collection("users").doc(this.loginService.user.uid).set(this.loginService.user)
        // 	.then(r => console.log("set wepay credentails for account", this.loginService.user.displayName, r))
        // 	.catch(e => console.log("failed to set wepay credentials for account", this.loginService.user.displayName, e))
    })
        .catch(e => console.log("something went wrong calling account/create", e));
    // res.send(p)
    // return p
});
exports.t = functions.https.onRequest((req, res) => {
    return https.get({ hostname: "http://www.google.com" }, r => {
        r.pipe(res);
        r.on('data', c => console.log(c));
        r.on('end', r => console.log("ended"));
    });
    // res.pipe(req)
    // res.send(new Promise((resolve, reject) => setTimeout(resolve, 200)).then(() => "dog"))
    // return request({
    // 	uri: "https://stage.wepayapi.com/v2/account/find",
    // 	method: "POST",
    // 	json: true,
    // 	resolveWithFullResponse: true,
    // 	headers: { Authorization: "Bearer " + wepay_settings.access_token }
    // })
    // 	.then(response => {
    // 		console.log(response)
    // 		return res.send("derp")
    // 	})
});
// res.send(p)
//    const options = {
//           headers: {
//               'Content-Type': 'application/json',
//               'Authorization': "Bearer " + wepay_settings.access_token
//           },
//           method: 'POST',
//           port: 443,
//           hostname: "stage.wepayapi.com",
//           path: "/v2/account/find"
//       }
// let request = https.request(options, r => {
// 	r.setEncoding("utf8")
// 	r.on("data", c => console.log("response chunk: ", c))
// })
// request.write(JSON.stringify({ "account_id": "somenumbers" }))
// request.end()
// res.end("derp derp derp")
//# sourceMappingURL=index.js.map
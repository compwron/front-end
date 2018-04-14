"use strict";
exports.__esModule = true;
var functions = require("firebase-functions");
var admin = require("firebase-admin");
var wepay_1 = require("wepay");
// const request = require('request-promise')
admin.initializeApp();
// import { db, firebase } from '../utilities/utilities'
var wepay_settings = {
    'client_id': '53075',
    'client_secret': '3abef328ac',
    // 'access_token'  : 'PRODUCTION_daa92de3877f13535a83209c7598e2c25c746395ade6e9782e78ed92b14336f5'
    'access_token': 'STAGE_28467f7ddf1ef46e545bed9a9cb18d3103fa4e46d8a278ff461f12150093c957'
};
var wp = new wepay_1.WEPAY(wepay_settings);
wp.use_staging();
// export const redirect = functions.https.onRequest((req, res) => {
// 	const { code, state } = req.body
// 	console.log(code, state)
// })
var promiseCall = function (url, data) {
    var p = new Promise(function (resolve, reject) { return wp.call(url, data, resolve); });
    return p;
};
// pay(JSON.stringify({ body: { account_id: 1397632302, amount: 10, fee: 1 } }))
// pay().form({ account_id: 1397632302, amount: 10, fee: 1 })
exports.pay = functions.https.onRequest(function (req, res) {
    console.log("in pay function");
    var _a = req.body, account_id = _a.account_id, amount = _a.amount, fee = _a.fee;
    console.log(account_id, amount, fee);
    // const account_id = "1397632302"
    // const amount = "50"
    // const fee = "5"
    var data = {
        account_id: account_id,
        amount: amount,
        "type": "donation",
        "currency": "USD",
        "short_description": "test payment",
        "long_description": "This is a test payment",
        "email_message": {
            "to_payer": "Please contact us at 555-555-555 if you need assistance."
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
    promiseCall('/checkout/create', data)
        .then(function (r) {
        console.log(r);
        res.send(r);
    })["catch"](function (e) { return console.log("something went wrong calling checkout/create", e); });
});
exports.register = functions.https.onRequest(function (req, res) {
    var _a = req.body, displayName = _a.displayName, uid = _a.uid;
    console.log("in register function");
    var data = {
        "name": displayName,
        "description": "pridepocket donation account",
        "reference_id": uid,
        "country": "US",
        "currencies": [
            "USD"
        ]
    };
    return promiseCall('/account/create', data)
        .then(function (r) {
        return res.send(r);
    })["catch"](function (e) { return console.log("something went wrong calling account/create", e); });
});
// console.log("response to wepay API call: ", r)
// return r
// this.loginService.user.wepay = response
// db.collection("users").doc(this.loginService.user.uid).set(this.loginService.user)
// 	.then(r => console.log("set wepay credentails for account", this.loginService.user.displayName, r))
// 	.catch(e => console.log("failed to set wepay credentials for account", this.loginService.user.displayName, e))

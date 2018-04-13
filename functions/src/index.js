"use strict";
exports.__esModule = true;
var functions = require("firebase-functions");
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.helloWorld = functions.https.onRequest(function (request, response) {
    response.send("Hello from Firebase!");
});
var wepay_1 = require("wepay");
// import { db, firebase } from '../utilities/utilities'
var wepay_settings = {
    'client_id': '110229',
    'client_secret': '32fe4f7479',
    'access_token': 'PRODUCTION_daa92de3877f13535a83209c7598e2c25c746395ade6e9782e78ed92b14336f5'
};
var wp = new wepay_1.WEPAY(wepay_settings);
wp.use_staging();
var promiseCall = function (url, data) { return new Promise(function (resolve, reject) { return wp.call(url, data, resolve); }); };
exports.pay = functions.https.onRequest(function (request, response) {
    var _a = request.body, account_id = _a.account_id, amount = _a.amount, fee = _a.fee;
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
    promiseCall('/checkout/create', JSON.stringify(data))
        .then(function (r) {
        // insert transaction in the database
        console.log(r);
        response.end(r);
    })["catch"](function (e) { return console.log("something went wrong calling checkout/create", e); });
});
// https://us-central1-pridepocket-3473b.cloudfunctions.net/register
// curl -H 'content-type: application/json' -d '{"displayName":"donkey","uid":"12345678"}' https://us-central1-pridepocket-3473b.cloudfunctions.net/register
// form = {"displayName":"donkey","uid":"12345678"}
exports.register = functions.https.onRequest(function (req, res) {
    console.log(req.body);
    // res.end("boop boop boop boop boop")
    var _a = req.body, displayName = _a.displayName, uid = _a.uid;
    var data = {
        name: displayName,
        description: "wepay account for " + displayName,
        reference_id: uid,
        country: "US",
        currenices: ["USD"]
    };
    promiseCall('/account/create', JSON.stringify(data))
        .then(function (r) {
        console.log(r);
        res.end(r);
        // this.loginService.user.wepay = response
        // db.collection("users").doc(this.loginService.user.uid).set(this.loginService.user)
        // 	.then(r => console.log("set wepay credentails for account", this.loginService.user.displayName, r))
        // 	.catch(e => console.log("failed to set wepay credentials for account", this.loginService.user.displayName, e))
    })["catch"](function (e) { return console.log("something went wrong calling account/create", e); });
    // wp.call('/account/create', JSON.stringify(data))
});

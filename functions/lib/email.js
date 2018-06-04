"use strict";
// https://nodemailer.com/usage/
// https://nodemailer.com/about/
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
// const admin = require("firebase-admin")
const nodemailer = require('nodemailer');
// copy the 'email-templates' folder into functions/lib to avoid compilation problems
const { personalize: campaignEnd } = require('./email-templates/camp-end');
const { personalize: contributionThankYou } = require('./email-templates/contribution-ty');
const { personalize: contributionEmail } = require('./email-templates/contribution');
const { personalize: draftCamp } = require('./email-templates/draft-camp');
const { personalize: exceed } = require('./email-templates/exceed-amount');
const { personalize: launch } = require('./email-templates/launch-camp');
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    }
});
// const emailTypes = {
// 	"campaign-end": campaignEnd,
// 	"contribution-thankyou": contributionThankYou,
// 	"contribution": contributionEmail,
// 	"draft-camp": draftCamp,
// 	"exceed-amount": exceed,
// 	"launch-camp": launch
// }
const sendMail = options => {
    console.log(functions.config().gmail);
    return mailTransport.sendMail(options)
        .then((info) => {
        console.log(info);
        return;
    })
        .catch(e => {
        console.log(e);
        return;
    });
};
exports.campExpired = campaign => sendMail({ from: "Info", to: campaign.owner.email, subject: "Your Pride Pocket Campaign has Ended.", html: campaignEnd(campaign) });
exports.campaignLaunched = campaign => sendMail({ from: "Info", to: campaign.owner.email, subject: "Your campaign is live! Spread the word", html: launch(campaign) });
exports.draftCampaignCreated = campaign => sendMail({ from: "Info", to: campaign.owner.email, subject: "You have created a draft campaign", html: draftCamp(campaign) });
exports.goalExceeded = campaign => sendMail({ from: "Info", to: campaign.owner.email, subject: "Your Pride Pocket Campaign exceeded your goal!", html: exceed(campaign) });
exports.donationReceived = changeInfo => {
    const mailOptions = { from: "Info", to: changeInfo.owner.email, subject: "You have received a donation!", html: contributionEmail(changeInfo) };
    return mailTransport.sendMail(mailOptions)
        .then(info => {
        return sendMail({ from: "Info", to: changeInfo.payment.payer.email, subject: "Thank you for contributing!!", html: contributionThankYou(changeInfo) });
    })
        .catch(e => {
        console.log(e);
        return;
    });
};
//# sourceMappingURL=email.js.map
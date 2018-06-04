"use strict";
// https://nodemailer.com/usage/
// https://nodemailer.com/about/
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const nodemailer = require('nodemailer');
// copy the 'email-templates' folder into functions/lib to avoid compilation problems
const { personalize: campaignEnd } = require('./email-templates/camp-end');
const { personalize: contributionThankYou } = require('./email-templates/contribution-ty');
const { personalize: contributionEmail } = require('./email-templates/contribution');
const { personalize: draftCamp } = require('./email-templates/draft-camp');
const { personalize: exceed } = require('./email-templates/exceed-amount');
const { personalize: launch } = require('./email-templates/launch-camp');
// const gmailEmail = functions.config().gmail.email
// const gmailPassword = functions.config().gmail.password
const gmailEmail = "cjohnson6382@gmail.com";
const gmailPassword = "goatsarethe|33$T";
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    }
});
const emailTypes = {
    "campaign-end": campaignEnd,
    "contribution-thankyou": contributionThankYou,
    "contribution": contributionEmail,
    "draft-camp": draftCamp,
    "exceed-amount": exceed,
    "launch-camp": launch
};
exports.email = (type, to, subject, config) => {
    const html = emailTypes[type](config);
    const mailOptions = { from: "Info", to, subject, html };
    return mailTransport.sendMail(mailOptions)
        .then((info) => {
        console.log(info);
        return;
    })
        .catch(e => {
        console.log(e);
        return;
    });
};
const sendMail = options => mailTransport.sendMail(options)
    .then((info) => {
    console.log(info);
    return;
})
    .catch(e => {
    console.log(e);
    return;
});
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
// const campEnd = campaign => {
// 	cosnt mailOptions = {
// 		from: "Info",
// 		to: campaign.owner.email,
// 		subject: `Your campaign (${ campaign.name }) has ended`,
// 		html: campaignEnd(campaign)
// 	}
// 	return mailTransport.sendMail(mailOptions)
// 		.then((info) => res.send(info.toString()))
// 		.catch(e => res.send(e.string()))
// }
// const contributionThanks = campaign => {
// 	const template = contributionThankYou(campaign)
// }
// const contribution = campaign => {
// 	const template = contributionEmail(campaign)
// }
// const draftCampaign = user => {
// 	const template = draftCamp(user)
// }
// const exceedAmount = campaign => {
// 	const template = exceed(campaign)
// }
// const launchCamp = user => {
// 	const template = launch(user)
// }
// const welCreateCamp //	what is this template for?
//# sourceMappingURL=email.js.map
// https://nodemailer.com/usage/
// https://nodemailer.com/about/
// import * as functions from 'firebase-functions';
// const admin = require("firebase-admin")
const nodemailer = require('nodemailer');
const { personalize: campaignEnd } = require('./email-templates/camp-end');
const { personalize: contributionThankYou } = require('./email-templates/contribution-ty');
const { personalize: contributionEmail } = require('./email-templates/contribution');
const { personalize: draftCamp } = require('./email-templates/draft-camp');
const { personalize: exceed } = require('./email-templates/exceed-amount');
const { personalize: launch } = require('./email-templates/launch-camp');
// const gmailEmail = functions.config().gmail.email
// const gmailPassword = functions.config().gmail.password
const gmailEmail = "email";
const gmailPassword = "password";
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
const email = (type, to, subject, config) => {
    const html = emailTypes[type](config);
    const mailOptions = { from: "Info", to, subject, html };
    return mailTransport.sendMail(mailOptions)
        .then((info) => console.log(info.toString()))
        .catch(e => console.log(e.string()));
};
exports.email = email;
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
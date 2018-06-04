import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'
import { fromPromise } from 'rxjs/observable/fromPromise'

import { LoginService } from './login.service'

import { Campaign } from '../objects/Campaign'

import { db, firebase } from '../utilities/utilities'


@Injectable()
export class CampaignCreatorService {
	
	constructor(
		private loginService: LoginService
	) { }
	
	create (): Function {
		return (campaign: Campaign): Observable<void> => {
			// this converts the string dates returned by the frontend to datetime objects which firestore stores as timestamp objects...
			campaign.end = new Date(campaign.end)
			if (campaign.active) campaign.begin = new Date()
			campaign._updated = new Date()
			const { uid, email, displayName } = this.loginService.pridepocketUser
			campaign.owner = Object.assign({}, campaign.owner, { uid, email, name: displayName })
			
			campaign.account_id = this.loginService.pridepocketUser.wepay_merchant.account_id
			
			const docRef = db.collection("campaigns").doc()
			campaign.id = docRef.id
			
			// console.log(campaign)
			
			return fromPromise(docRef.set(campaign))
		}
	}
	
	edit (): Function {
		return (campaign: Campaign): Observable<void> => {
			// console.log("campaign in campaign edit: ", campaign)
			
			if (campaign.active && !campaign.begin) campaign.begin = new Date()
			if (typeof campaign.end === 'string') campaign.end = new Date(campaign.end)
			
			// campaign.end = new Date(campaign.end)
			// if (campaign.active) campaign.begin = new Date(campaign.begin)
			campaign._updated = new Date()
			
			return fromPromise(db.collection("campaigns").doc(campaign.id).set(campaign, { merge: true }))
		}
	}
	
	del (id: string): Observable<void> {
		return fromPromise(db.collection("campaigns").doc(id).delete())
	}
	
}

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
			if (campaign.active) campaign.begin = new Date(campaign.begin)
			campaign._updated = new Date()
			campaign.owner = Object.assign({}, campaign.owner, { uid: this.loginService.pridepocketUser.uid })
			
			campaign.account_id = this.loginService.pridepocketUser.wepay_merchant.account_id
			
			// console.log(campaign)
			
			return fromPromise(db.collection("campaigns").doc().set(campaign))
		}
	}
	
	edit (): Function {
		return (campaign: Campaign): Observable<void> => {
			console.log("campaign in campaign edit: ", campaign)
			
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

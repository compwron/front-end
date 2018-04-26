import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'
import { fromPromise } from 'rxjs/observable/fromPromise'

import { Campaign } from '../objects/Campaign'

import { db, firebase } from '../utilities/utilities'

@Injectable()
export class CampaignOneService {
	constructor() { }
	
	get (id): Observable<object> {
		const dbObject = fromPromise(db.collection("campaigns").doc(id).get())
		
		const extractCampaign = map((response: firebase.firestore.DocumentSnapshot) => {
			const c = response.data()
			return Object.assign(
				{},
				c,
				{
					id: response.id,
					_updated: c._updated.toDate(),
					begin: c.begin ? c.begin.toDate() : null,
					end: c.end ? c.end.toDate() : null
				}
			)
		})
		const campaign =  extractCampaign(dbObject)
		return campaign
	}
}
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'
import { fromPromise } from 'rxjs/observable/fromPromise'

import { Campaign } from '../objects/Campaign'

// import { User } from '../objects/campaign'
// import { Article } from '../objects/campaign'

import { db, firebase } from '../utilities/utilities'


const extractCampaigns = map((snapshot: firebase.firestore.QuerySnapshot): Campaign[] => {
	if (!snapshot.empty) {
		let campaigns = []
		snapshot.forEach(c => {
			let campaign = c.data()
			campaigns.push(Object.assign(
				{},
				campaign,
				//	the Timestamp.toDate() is because of a firebase change; I need a date object to work with the Angular pipe
				{
					id: c.id,
					_updated: campaign._updated.toDate(),
					begin: campaign.begin ? campaign.begin.toDate() : null,
					end: campaign.end ? campaign.end.toDate() : null
			}))
		})
		return campaigns
	}
	else return []
})

@Injectable()
export class CampaignService {
	constructor() { }

	subscribeCampaigns (filter): Observable<Campaign[]> {
		const camps: Observable<firebase.firestore.QuerySnapshot> = new Observable(observer => {
			db.collection("campaigns").where(filter.field, filter.operator, filter.value).onSnapshot(observer)
		})
		
		const campaigns: Observable<Campaign[]> = extractCampaigns(camps)
		return campaigns
	}

	getCampaigns(filter = null): Observable<Campaign[]> {
		console.log("getting campaigns")
		
		let dbObjects
		
		if (filter) dbObjects = fromPromise(db.collection("campaigns").where(filter.field, filter.operator, filter.value).get())
		else dbObjects = fromPromise(db.collection("campaigns").get())
		
		// const dbObjects = fromPromise(db.collection("campaigns").get())
		
		const campaigns = extractCampaigns(dbObjects)
		return campaigns
	}

}
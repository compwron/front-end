import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'
import { fromPromise } from 'rxjs/observable/fromPromise'

import { Campaign } from '../objects/Campaign'

import { db } from '../utilities/utilities'

@Injectable()
export class CampaignOneService {
	constructor() { }
	
	get (id): Observable<Campaign> {
		const dbObject = fromPromise(db.collection("campaigns").doc(id).get())
		const extractCampaign = map(response => Object.assign({}, response.data(), { id: response.id }))
		const campaign =  extractCampaign(dbObject)
		return campaign
	}
}
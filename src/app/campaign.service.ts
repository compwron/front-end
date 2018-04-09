import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'
import { fromPromise } from 'rxjs/observable/fromPromise'

import { Campaign } from '../objects/campaign'

import { User } from '../objects/campaign'
import { Article } from '../objects/campaign'

import { db } from './utilities/utilities'

@Injectable()
export class CampaignService {
	constructor() { }

	getCampaigns(): Observable<Campaign[]> {
		const dbObjects = fromPromise(db.collection("campaigns").get())

		const extractCampaigns = map(snapshot => {
			let campaigns: Campaign[] = []
			snapshot.forEach(c => campaigns.push(Object.assign({}, c.data(), { id: c.id })))
			return campaigns
		}
		const campaigns = extractCampaigns(dbObjects)

		return campaigns
	}

}
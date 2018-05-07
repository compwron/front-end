import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'
import { fromPromise } from 'rxjs/observable/fromPromise'

import { Campaign } from '../objects/Campaign'

import { db, firebase } from '../utilities/utilities'


@Injectable()
export class CampaignCreatorService {
	
	constructor() { }
	
	create (campaign: Campaign): Observable<void> {
		// need to add 'begin' and '_updated' fields
		// end needs to be saved as a timestamp
		return fromPromise(db.collection("campaigns").doc().set(campaign))
	}
	
}

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'
import { fromPromise } from 'rxjs/observable/fromPromise'

import { Campaign } from '../objects/Campaign'

import { db, firebase } from '../utilities/utilities'

@Injectable()
export class CampaignOneService {
	constructor() { }
	
	get (id, callback): void {
		db.collection("campaigns").doc(id).onSnapshot((doc: firebase.firestore.DocumentSnapshot) => {
			const c = doc.data()
			const campaign = Object.assign({}, c, {
				id: doc.id,
				_updated: c._updated.toDate(),
				begin: c.begin ? c.begin.toDate() : null,
				end: c.end ? c.end.toDate() : null })
			callback(campaign)
		})
	}
}
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'
import { fromPromise } from 'rxjs/observable/fromPromise'

import { Campaign } from '../objects/Campaign'

import { db, firebase } from '../utilities/utilities'

@Injectable()
export class CampaignOneService {
	constructor() { }
	
	get (id): Observable<Campaign> {
		return new Observable(observer => {
			db.collection("campaigns").doc(id).onSnapshot({
				next: (doc: firebase.firestore.DocumentSnapshot) => {
					const c = doc.data()
					// eslint-disable-next-line
					const campaign: Campaign = <Campaign>Object.assign({}, c, {
						id: doc.id,
						_updated: c._updated.toDate(),
						begin: c.begin ? c.begin.toDate() : null,
						end: c.end ? c.end.toDate() : null })

					observer.next(campaign)
				},
				error: e => observer.error(e),
				complete: () => observer.complete()
			})
		})
	}
}
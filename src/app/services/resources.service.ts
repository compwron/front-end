import { Injectable } from '@angular/core';

import { fromPromise } from 'rxjs/observable/fromPromise'
import { from } from 'rxjs/observable/from'
import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'


import { db, firebase } from '../utilities/utilities'

// import { User, UserUpdateObject } from '../objects/UserInterfaces'
// import { Donation } from '../objects/Donation'

import { Resource } from '../objects/Resource'

@Injectable()
export class ResourcesService {
	constructor() { }
	
	resources: Resource[] = []

	// modifyUser (update: UserUpdateObject): Observable<void> {
	// 	console.log(update)
	// 	return fromPromise(db.collection("users").doc(this.user.uid).set(update, { merge: true }))
		
	// }
	getResources (): Observable<Resource[]> {
		const dbSnapshot = fromPromise(db.collection("resources").get())
		
		const extractResources = map((snapshot: firebase.firestore.QuerySnapshot) => {
			if (!snapshot.empty) {
				let resources = []
				snapshot.forEach(r => {
					let resource = r.data()
					resources.push(Object.assign(
						{},
						resource,
						//	the Timestamp.toDate() is because of a firebase change; I need a date object to work with the Angular pipe
						{
							id: r.id,
							// _updated: campaign._updated.toDate(),
							// begin: campaign.begin ? campaign.begin.toDate() : null,
							// end: campaign.end ? campaign.end.toDate() : null
						}
					))
				})
				return resources
			}
			else return []
		})

		return extractResources(dbSnapshot)
	}
	// deactivate (): Observable<void> { return fromPromise(db.collection("users").doc(this.user.uid).set({ active: false }, { merge: true })) }
}
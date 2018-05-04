import { Injectable } from '@angular/core';

import { fromPromise } from 'rxjs/observable/fromPromise'
import { from } from 'rxjs/observable/from'
import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'


import { db, firebase } from '../utilities/utilities'

// import { User, UserUpdateObject } from '../objects/UserInterfaces'
// import { Donation } from '../objects/Donation'

import { Resource } from '../objects/Resource'


const extractor = (collection: string) => {
	return map((snapshot: firebase.firestore.QuerySnapshot) => {
		if (!snapshot.empty) {
			let dbResources = []
			snapshot.forEach(r => {
				let dbResource = r.data()
				dbResources.push(Object.assign(
					{},
					dbResource,
					categories[collection](dbResource.data(), dbResource.id)
				))
			})
			return dbResources
		}
		else return []
	})
}

// transform functions
const categories = {
	categories: (data, id) => null,
	resources: (data, id) => ({ id }),
	campaigns: (data, id) => ({
		id,
		_updated: data._updated.toDate(),
		begin: data.begin ? data.begin.toDate() : null,
		end: data.end ? data.end.toDate() : null
	})
}

const dbGetMany = (collection: string): Observable<firebase.firestore.QuerySnapshot> => fromPromise(db.collection(collection).get())


@Injectable()
export class ResourcesService {
	constructor() { }
	
	resources: Resource[] = []
	categories: string[] = []
	
	getCategories (): Observable<string[]> { return extractor["categories"]("categories") }
	
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
						{
							id: r.id
						}
					))
				})
				return resources
			}
			else return []
		})

		return extractResources(dbSnapshot)
	}
}
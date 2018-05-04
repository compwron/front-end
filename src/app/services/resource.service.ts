import { Injectable } from '@angular/core'

import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'
import { fromPromise } from 'rxjs/observable/fromPromise'

import { Resource } from '../objects/Resource'

import { db, firebase } from '../utilities/utilities'

@Injectable()
export class ResourceService {
	constructor() { }
	
	get (id): Observable<firebase.firestore.DocumentSnapshot> {
		return new Observable(observer => db.collection("resources").doc(id).onSnapshot(observer))
	}
}
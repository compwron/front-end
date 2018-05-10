import { Injectable } from '@angular/core';

import { fromPromise } from 'rxjs/observable/fromPromise'
import { Observable } from 'rxjs/Observable'

import { firebase } from '../utilities/utilities'

const storage = firebase.storage()

interface Uploading {
	(key: string): number
}


const initialize = uploadTask => {
	return new Observable(observer => {
		uploadTask.on("state_changed", {
			next: snapshot => observer.next(snapshot),
			error: e => observer.error(e),
			complete: () => observer.complete()
		})
	})
}

const progress = response => new Observable(observer => response.subscribe(
		snapshot => { console.log((snapshot.bytesTransferred / snapshot.totalBytes) * 100) },
		e => observer.error(e),
		() => {
			observer.next()
			observer.complete()
		}
	)
)

const extractUrl = ref => response => { return new Observable(observer => response.subscribe(
	() => fromPromise(ref.getDownloadURL()).subscribe(url => observer.next(url)),
	e => console.log("error in extractUrl", e),
	() => console.log("extractUrl complete")
))}

@Injectable()
export class StorageBucketService {
	
	uploading: string[] = []
	
	constructor() { }

	store (file: File, type: string): Observable<any> {
		const ref = storage.ref()
		const fileRef = ref.child(`/${type}/${file.name}`)
		// this.uploading[ref.name] = { progress: 0, uploadTask: null }

		const uploadTask = fileRef.put(file)

		return initialize(uploadTask).pipe(
			progress,
			extractUrl(fileRef)
		)
	}

	getProgress (name: string): number {
		if (this.uploading[name]) return
	}
}

import { Injectable } from '@angular/core';

import { fromPromise } from 'rxjs/observable/fromPromise'
import { Observable } from 'rxjs/Observable'

import { firebase } from '../utilities/utilities'

const storage = firebase.storage()

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
		snapshot => observer.next((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
		e => observer.error(e),
		() => {
			observer.next()
			observer.complete()
		}
	)
)

const extractUrl = ref => response => { return new Observable(observer => response.subscribe(
	status => observer.next(status),
	e => console.log("error in extractUrl", e),
	() => {
		fromPromise(ref.getDownloadURL()).subscribe(
			url => observer.next({ url, fullPath: ref.fullPath }),
			e => observer.error(e),
			() => observer.complete()
		)
	}
))}

@Injectable()
export class StorageBucketService {
	
	uploading: string[] = []
	
	constructor() { }

	store (file: File, type: string): Observable<any> {
		const fileRef = storage.ref().child(`/${type}/${file.name}`)
		const uploadTask = fileRef.put(file)

		return initialize(uploadTask).pipe(
			progress,
			extractUrl(fileRef)
		)
	}
	
	delete (path) { return fromPromise(storage.ref(path).delete()) }
}

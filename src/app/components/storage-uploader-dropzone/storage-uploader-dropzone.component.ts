import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { StorageBucketService } from '../../services/storage-bucket.service'

@Component({
  selector: 'app-storage-uploader-dropzone',
  templateUrl: './storage-uploader-dropzone.component.html',
  styleUrls: ['./storage-uploader-dropzone.component.scss']
})
export class StorageUploaderDropzoneComponent implements OnInit {
	@Input() storeType: string
	@Output() urlReturned = new EventEmitter<any>()

	uploadStatus: number = 0
	url: string = ""
	fullPath: string = ""

	constructor(
		private storage: StorageBucketService
	) { }
	
	ngOnInit() {
		if (!this.storeType) console.log("Devewloper: you must provide a 'type: string' parameter; it will be the name of the folder on storage in which uploads live")
	}
	
	store (file) {
		this.storage.store(file, this.storeType)
			.subscribe(
				(storageReturn: any): void => {
					if (+storageReturn) this.uploadStatus = storageReturn
					else if (typeof storageReturn === "object") {
						this.url = storageReturn.url
						this.fullPath = storageReturn.fullPath
					}
					else console.log("url is not a string or number: ", typeof storageReturn, storageReturn)
				},
				(e): void => { console.log("error", e) },
				(): void => {
					this.uploadStatus = 0
					this.urlReturned.emit({ url: this.url, fullPath: this.fullPath })
					// this.ret()
				}
			)
	}
	
	drop (e) {
		e.preventDefault()
		
		if (e.dataTransfer.items) {
			for (let f in e.dataTransfer.items) {
				if (e.dataTransfer.items[f].kind === "file") {
					let file = e.dataTransfer.items[f].getAsFile()
					this.store(file)
				}
			}
		}
		else {
			for (let f in e.dataTransfer.files) {
				let file = e.dataTransfer.files[f]
				this.store(file)
			}
		}
	}

	fileSelect (e) { this.store(e.target.files[0]) }
	
	// dragstart (e) {
	// 	console.log("dragstart: ", e.dataTransfer.setData)
	// 	e.dataTransfer.setData("text", e.target.id)
		
	// }
	
	dragover (e) { e.preventDefault() }

}
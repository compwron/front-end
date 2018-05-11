import { Component, OnInit } from '@angular/core';

import { StorageBucketService } from '../../services/storage-bucket.service'

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {

	uploadStatus: number = 0
	url: string = ""
	fullPath: string = ""

	constructor(
		private storage: StorageBucketService
	) { }
	
	ngOnInit() {
	}
	
	store (file) {
		this.storage.store(file, 'test')
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
					console.log(this.url, this.fullPath)
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
	
	dragstart (e) {
		console.log("dragstart: ", e.dataTransfer.setData)
		e.dataTransfer.setData("text", e.target.id)
		
	}
	dragover (e) { e.preventDefault() }

}

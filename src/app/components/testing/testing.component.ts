import { Component, OnInit } from '@angular/core';

import { StorageBucketService } from '../../services/storage-bucket.service'

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {

	uploadStatus = 0

	constructor(
		private storage: StorageBucketService
	) { }
	
	ngOnInit() {
	}
	
	onFileChange (e) {
		const [ file ] = e.target.files
		
		this.storage.store(file, 'test')
			.subscribe(
				(url: any): void => {
					if (+url) this.uploadStatus = url
					else if (typeof url === "object") console.log("url object", url)
					else console.log("url is not a string or number: ", typeof url, url)
				},
				(e): void => { console.log("error", e) },
				(): void => {
					console.log("complete")
					this.uploadStatus = 0
				}
			)
	}

}

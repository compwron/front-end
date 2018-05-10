import { Component, OnInit } from '@angular/core';

import { StorageBucketService } from '../../services/storage-bucket.service'

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {

	constructor(
		private storage: StorageBucketService
	) { }
	
	ngOnInit() {
	}
	
	onFileChange (e) {
		const [ file ] = e.target.files
		
		this.storage.store(file, 'test')
			.subscribe(
				(url: string): void => { console.log("should be a URL: ", url) },
				(e): void => { console.log("error", e) },
				(): void => { console.log("complete") }
			)
	}

}

import { Component, OnInit } from '@angular/core';

import { ResourcesService } from '../../../services/resources.service'

import { Resource } from '../../../objects/Resource'

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {
	resources: Resource[] = []
	
	constructor(
		private resourcesService: ResourcesService
	) { }
	
	ngOnInit() {
		this.getResources()
	}

	getResources () {
		this.resourcesService.getResources()
			.subscribe(
				(resources: Resource[]): void => { this.resources = resources },
				e => console.log("", e),
				() => console.log("")
			)
	}

}

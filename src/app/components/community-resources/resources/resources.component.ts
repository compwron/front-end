import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable'
import { ResourcesService } from '../../../services/resources.service'

import { Resource } from '../../../objects/Resource'

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {
	resources: Resource[] = []
	categories: string[] = []
	
	constructor(
		private resourcesService: ResourcesService
	) { }
	
	ngOnInit() { this.getResources() }

	getCategories (): Observable<string[]> { return this.resourcesService.getCategories() }

	sortResources (resources: Resource[]): Resource[] { return resources }
	getResources (): void {
		this.resourcesService.getResources()
			.subscribe(
				(resources: Resource[]): void => { this.resources = this.sortResources(resources) },
				e => console.log("error getting resources from DB", e),
				() => console.log("completed getting resources from DB")
			)
	}

}

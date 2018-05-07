import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

import { ResourceService } from '../../../services/resource.service'
import { Resource } from '../../../objects/Resource'

import { firebase } from '../../../utilities/utilities'

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
	resource: Resource = { author: { displayName: "", uid: "", profile_pic: "" }, categories: [], banner: "", banner_large: "", title: "", teaser: "" }
	categories: Array<string> = []

	constructor(
		private resourceService: ResourceService,
		private route: ActivatedRoute
	) { }
	
	ngOnInit() {
		this.getResource()
	}
	
	getResource (): void {
		const id = this.route.snapshot.paramMap.get('id')
		this.resourceService.get(id)
			.subscribe(
				(doc: firebase.firestore.DocumentSnapshot): void => {
					this.resource = <Resource>Object.assign({}, doc.data(), { id: doc.id })
					this.categories = Object.keys(this.resource.categories)
				},
				(e): void => console.log("error in resource subscriber", e),
				() => console.log("resourceService get completed")
			)
	}

}
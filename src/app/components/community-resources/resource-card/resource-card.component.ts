import { Component, OnInit, Input } from '@angular/core'

import { Resource } from '../../../objects/Resource'

@Component({
  selector: 'app-resource-card',
  templateUrl: './resource-card.component.html',
  styleUrls: ['./resource-card.component.scss']
})
export class ResourceCardComponent implements OnInit {
	@Input() resource: Resource

	constructor() { }
	
	ngOnInit() {
	}

}